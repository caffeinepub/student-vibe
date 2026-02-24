import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include authorization and storage mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
    college : Text;
    isPremium : Bool;
    isAdmin : Bool;
    bio : ?Text;
    yearOfStudy : ?Text;
    department : ?Text;
  };

  public type NoteMetadata = {
    subject : Text;
    topic : Text;
    semester : Text;
    college : Text;
    uploader : Principal;
    uploadTime : Time.Time;
  };

  public type Note = {
    id : Text;
    metadata : NoteMetadata;
    blob : Storage.ExternalBlob;
  };

  public type StudyGroup = {
    id : Text;
    name : Text;
    description : Text;
    creator : Principal;
    members : [Principal];
    createdAt : Time.Time;
  };

  public type QuizQuestion = {
    question : Text;
    options : [Text];
    answer : Text;
  };

  public type Quiz = {
    id : Text;
    questions : [QuizQuestion];
    creator : Principal;
    createdAt : Time.Time;
  };

  public type VivaQuestion = {
    question : Text;
    creator : Principal;
    createdAt : Time.Time;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let notes = Map.empty<Text, Note>();
  let studyGroups = Map.empty<Text, StudyGroup>();
  let quizzes = Map.empty<Text, Quiz>();
  let vivaQuestions = Map.empty<Text, [VivaQuestion]>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let actualIsAdmin = AccessControl.isAdmin(accessControlState, caller);
    userProfiles.add(caller, { profile with isAdmin = actualIsAdmin });
  };

  // Helper function to check premium status
  func isPremiumUser(user : Principal) : Bool {
    switch (userProfiles.get(user)) {
      case (null) { false };
      case (?profile) { profile.isPremium };
    };
  };

  // Admin Features
  public query ({ caller }) func getAdminUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func setUserPremiumStatus(user : Principal, isPremium : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update premium status");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        userProfiles.add(user, { profile with isPremium });
      };
    };
  };

  public shared ({ caller }) func setUserAdminStatus(user : Principal, isAdmin : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update admin status");
    };

    let newRole : AccessControl.UserRole = if (isAdmin) { #admin } else { #user };
    AccessControl.assignRole(accessControlState, caller, user, newRole);

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        userProfiles.add(user, { profile with isAdmin });
      };
    };
  };

  public shared ({ caller }) func searchUsersByEmail(searchTerm : Text) : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can search users by email");
    };

    userProfiles.values().toArray().filter(
      func(profile) {
        profile.email.contains(#text searchTerm);
      }
    );
  };

  // Notes Management
  public shared ({ caller }) func uploadNote(id : Text, metadata : NoteMetadata, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can upload notes");
    };
    let note : Note = {
      id;
      metadata;
      blob;
    };
    notes.add(id, note);
  };

  public query ({ caller }) func getNote(noteId : Text) : async ?Note {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view notes");
    };
    notes.get(noteId);
  };

  public query ({ caller }) func getNotesBySubject(subject : Text) : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can search notes");
    };
    notes.values().toArray().filter(
      func(note) {
        Text.equal(note.metadata.subject, subject);
      }
    );
  };

  // Study Group Management
  public shared ({ caller }) func createStudyGroup(id : Text, name : Text, description : Text) : async StudyGroup {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create study groups");
    };
    let group : StudyGroup = {
      id;
      name;
      description;
      creator = caller;
      members = [caller];
      createdAt = Time.now();
    };
    studyGroups.add(id, group);
    group;
  };

  public query ({ caller }) func getStudyGroup(groupId : Text) : async ?StudyGroup {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view study groups");
    };
    studyGroups.get(groupId);
  };

  public shared ({ caller }) func joinStudyGroup(groupId : Text) : async StudyGroup {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can join study groups");
    };
    switch (studyGroups.get(groupId)) {
      case (null) { Runtime.trap("Study group not found") };
      case (?group) {
        if (group.members.find(func(member) { member == caller }) != null) {
          Runtime.trap("Already a member of the study group");
        };
        let updatedGroup = {
          id = group.id;
          name = group.name;
          description = group.description;
          creator = group.creator;
          members = group.members.concat([caller]);
          createdAt = group.createdAt;
        };
        studyGroups.add(groupId, updatedGroup);
        updatedGroup;
      };
    };
  };

  // AI Features - Outcall Handlers (to be implemented on client-side)
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can use transformation functions");
    };
    OutCall.transform(input);
  };

  public shared ({ caller }) func generateSummaryFromAI(outcallUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can generate summaries");
    };
    if (not isPremiumUser(caller)) {
      Runtime.trap("Unauthorized: Premium subscription required for AI summary generation");
    };
    await OutCall.httpGetRequest(outcallUrl, [], transform);
  };

  public shared ({ caller }) func generateQuizFromAI(outcallUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can generate quizzes");
    };
    if (not isPremiumUser(caller)) {
      Runtime.trap("Unauthorized: Premium subscription required for AI quiz generation");
    };
    await OutCall.httpGetRequest(outcallUrl, [], transform);
  };

  public shared ({ caller }) func generateVivaFromAI(outcallUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can generate viva questions");
    };
    if (not isPremiumUser(caller)) {
      Runtime.trap("Unauthorized: Premium subscription required for AI viva question generation");
    };
    await OutCall.httpGetRequest(outcallUrl, [], transform);
  };

  // Quiz Management
  public shared ({ caller }) func saveQuiz(id : Text, questions : [QuizQuestion]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create quizzes");
    };
    let quiz : Quiz = {
      id;
      questions;
      creator = caller;
      createdAt = Time.now();
    };
    quizzes.add(id, quiz);
  };

  public query ({ caller }) func getQuiz(quizId : Text) : async ?Quiz {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view quizzes");
    };
    quizzes.get(quizId);
  };

  // Viva Questions Management
  public shared ({ caller }) func saveVivaQuestions(subject : Text, questions : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save viva questions");
    };
    let mappedQuestions = questions.map(
      func(q) {
        {
          question = q;
          creator = caller;
          createdAt = Time.now();
        };
      }
    );
    vivaQuestions.add(subject, mappedQuestions);
  };

  public query ({ caller }) func getVivaQuestions(subject : Text) : async [VivaQuestion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view viva questions");
    };
    switch (vivaQuestions.get(subject)) {
      case (null) { Runtime.trap("No viva questions found for this subject") };
      case (?questions) { questions };
    };
  };

  // Stripe Payment Integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can check Stripe configuration");
    };
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be configured first") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };
};
