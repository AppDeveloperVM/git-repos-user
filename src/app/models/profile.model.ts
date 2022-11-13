import { Repo } from "./repo.model";
import { User } from "./user.model";

export class Profile {
    user: User;
    repos: Array<Repo>;
}