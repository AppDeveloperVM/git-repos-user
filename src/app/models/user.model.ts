export class User {
    constructor(
        login: string,
        id: number,
        name: string,
        email: string,
        location: string,
        avatar_url: string,
        public_repos: string,
        public_gists: StringConstructor
    ){}
}