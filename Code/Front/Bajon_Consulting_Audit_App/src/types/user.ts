class user { 
    UID: string; 
    displayName: string; 
    email: string;
    phone: string;
    provider: string[];
    created_at: string;
    lastSignIn_at: string;
    lastName: string;
    firstName : string
    

    constructor(UID: string, displayName: string, email: string, phone: string, provider: string[], created_at: string, lastSignIn_at: string) {
        this.UID = UID;
        this.displayName = displayName;
        this.email = email;
        this.phone = phone;
        this.provider = provider;
        this.created_at = created_at;
        this.lastSignIn_at = lastSignIn_at;
        this.firstName = this.displayName.split(' ')[1];
        this.lastName = this.displayName.split(' ')[0];
    }

    //Getters 
    public get Uid(): string {
        return this.UID;
    }   

    public get DisplayName() : string {
        return this.displayName;
    }

    public get Email(): string { 
        return this.Email;
    }

    public get Phone(): string{
        return this.phone;
    }

    
    public get Provider(): string[]{
        return this.provider;
    }

    public get Created_at(): string{
        return this.Created_at;
    }

    public get LastSignIn_at(): string{
        return this.lastSignIn_at;
    }

    public get FirstName(): string{
        this.firstName = this.displayName.split(' ')[0];
        return this.lastName
    }

    public get LastName(): string{
        this.displayName = this.displayName.split(' ')[1];
        return this.lastName
    }


    //setter 

    public set Uid(UID : string){
        this.UID = UID;
    }

    public set DisplayName(displayName: string) {
        this.displayName = displayName;
    }
    
    
    public set Email(email : string) {
        this.email = email;
    }

    
    public set Phone(phone : string) {
        this.phone = phone;
    }

    public set Provider(provider: string){
        this.provider.push(provider)
    }    
    
}
