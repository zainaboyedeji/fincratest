
export interface Environment {
    name: "dev" | "staging" | "production";
    port: number;
    databaseUrl: string;
    jwtSecret: string;
}