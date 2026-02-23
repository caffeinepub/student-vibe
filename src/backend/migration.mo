import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    email : Text;
    college : Text;
    isPremium : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    college : Text;
    isPremium : Bool;
    bio : ?Text;
    yearOfStudy : ?Text;
    department : ?Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) {
        {
          name = oldProfile.name;
          email = oldProfile.email;
          college = oldProfile.college;
          isPremium = oldProfile.isPremium;
          bio = null;
          yearOfStudy = null;
          department = null;
        };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
