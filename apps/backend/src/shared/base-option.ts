type Operator = "=" | ">" | "<" | "contains" | ">=" | "<=";

export interface Options {
    field: string;
    op: Operator;
    value: any;
    key?:string
}