import { Provider } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ErrorFilter } from "./filter/error.filter";
import { ThrottlerGuard } from "@nestjs/throttler";

export const AppFilter: Provider = {
    provide: APP_FILTER,
    useClass: ErrorFilter
}

export const AppGuard: Provider = {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
}