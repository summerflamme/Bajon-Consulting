import { supabase } from "../../supabaseClient";

export type User = {
    id: number;
    name: string;
    email: string;
};

export async function fetchUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from("User")
        .select("*");

    if (error) {
        console.error("Erreur:", error);
        return [];
    }
    return data as User[];
}
