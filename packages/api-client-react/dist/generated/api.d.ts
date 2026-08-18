import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { GoalInput, HealthStatus, ListEntriesParams, LogEntry, LogEntryInput, LogbookSummary, MonthlyGoal } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListEntriesUrl: (params?: ListEntriesParams) => string;
/**
 * Returns entries within an optional inclusive date range.
 * @summary List logbook entries
 */
export declare const listEntries: (params?: ListEntriesParams, options?: Parameters<typeof customFetch>[1]) => Promise<LogEntry[]>;
export declare const getListEntriesQueryKey: (params?: ListEntriesParams) => readonly ["/api/entries", ...ListEntriesParams[]];
export declare const getListEntriesQueryOptions: <TData = Awaited<ReturnType<typeof listEntries>>, TError = ErrorType<unknown>>(params?: ListEntriesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEntries>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEntries>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEntriesQueryResult = NonNullable<Awaited<ReturnType<typeof listEntries>>>;
export type ListEntriesQueryError = ErrorType<unknown>;
/**
 * @summary List logbook entries
 */
export declare function useListEntries<TData = Awaited<ReturnType<typeof listEntries>>, TError = ErrorType<unknown>>(params?: ListEntriesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEntries>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateEntryUrl: () => string;
/**
 * @summary Create a logbook entry
 */
export declare const createEntry: (logEntryInput: LogEntryInput, options?: Parameters<typeof customFetch>[1]) => Promise<LogEntry>;
export declare const getCreateEntryMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEntry>>, TError, {
        data: BodyType<LogEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createEntry>>, TError, {
    data: BodyType<LogEntryInput>;
}, TContext>;
export type CreateEntryMutationResult = NonNullable<Awaited<ReturnType<typeof createEntry>>>;
export type CreateEntryMutationBody = BodyType<LogEntryInput>;
export type CreateEntryMutationError = ErrorType<void>;
/**
* @summary Create a logbook entry
*/
export declare const useCreateEntry: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEntry>>, TError, {
        data: BodyType<LogEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createEntry>>, TError, {
    data: BodyType<LogEntryInput>;
}, TContext>;
export declare const getGetEntryUrl: (date: string) => string;
/**
 * @summary Get one logbook entry
 */
export declare const getEntry: (date: string, options?: Parameters<typeof customFetch>[1]) => Promise<LogEntry>;
export declare const getGetEntryQueryKey: (date: string) => readonly [`/api/entries/${string}`];
export declare const getGetEntryQueryOptions: <TData = Awaited<ReturnType<typeof getEntry>>, TError = ErrorType<void>>(date: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEntry>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getEntry>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetEntryQueryResult = NonNullable<Awaited<ReturnType<typeof getEntry>>>;
export type GetEntryQueryError = ErrorType<void>;
/**
 * @summary Get one logbook entry
 */
export declare function useGetEntry<TData = Awaited<ReturnType<typeof getEntry>>, TError = ErrorType<void>>(date: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getEntry>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateEntryUrl: (date: string) => string;
/**
 * @summary Replace a logbook entry
 */
export declare const updateEntry: (date: string, logEntryInput: LogEntryInput, options?: Parameters<typeof customFetch>[1]) => Promise<LogEntry>;
export declare const getUpdateEntryMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateEntry>>, TError, {
        date: string;
        data: BodyType<LogEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateEntry>>, TError, {
    date: string;
    data: BodyType<LogEntryInput>;
}, TContext>;
export type UpdateEntryMutationResult = NonNullable<Awaited<ReturnType<typeof updateEntry>>>;
export type UpdateEntryMutationBody = BodyType<LogEntryInput>;
export type UpdateEntryMutationError = ErrorType<void>;
/**
* @summary Replace a logbook entry
*/
export declare const useUpdateEntry: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateEntry>>, TError, {
        date: string;
        data: BodyType<LogEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateEntry>>, TError, {
    date: string;
    data: BodyType<LogEntryInput>;
}, TContext>;
export declare const getDeleteEntryUrl: (date: string) => string;
/**
 * @summary Delete a logbook entry
 */
export declare const deleteEntry: (date: string, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteEntryMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteEntry>>, TError, {
        date: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteEntry>>, TError, {
    date: string;
}, TContext>;
export type DeleteEntryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteEntry>>>;
export type DeleteEntryMutationError = ErrorType<void>;
/**
* @summary Delete a logbook entry
*/
export declare const useDeleteEntry: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteEntry>>, TError, {
        date: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteEntry>>, TError, {
    date: string;
}, TContext>;
export declare const getGetGoalUrl: () => string;
/**
 * @summary Get the current monthly goal
 */
export declare const getGoal: (options?: Parameters<typeof customFetch>[1]) => Promise<MonthlyGoal>;
export declare const getGetGoalQueryKey: () => readonly ["/api/goal"];
export declare const getGetGoalQueryOptions: <TData = Awaited<ReturnType<typeof getGoal>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGoal>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGoal>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGoalQueryResult = NonNullable<Awaited<ReturnType<typeof getGoal>>>;
export type GetGoalQueryError = ErrorType<unknown>;
/**
 * @summary Get the current monthly goal
 */
export declare function useGetGoal<TData = Awaited<ReturnType<typeof getGoal>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGoal>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateGoalUrl: () => string;
/**
 * @summary Update the current monthly goal
 */
export declare const updateGoal: (goalInput: GoalInput, options?: Parameters<typeof customFetch>[1]) => Promise<MonthlyGoal>;
export declare const getUpdateGoalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGoal>>, TError, {
        data: BodyType<GoalInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGoal>>, TError, {
    data: BodyType<GoalInput>;
}, TContext>;
export type UpdateGoalMutationResult = NonNullable<Awaited<ReturnType<typeof updateGoal>>>;
export type UpdateGoalMutationBody = BodyType<GoalInput>;
export type UpdateGoalMutationError = ErrorType<unknown>;
/**
* @summary Update the current monthly goal
*/
export declare const useUpdateGoal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGoal>>, TError, {
        data: BodyType<GoalInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGoal>>, TError, {
    data: BodyType<GoalInput>;
}, TContext>;
export declare const getGetSummaryUrl: () => string;
/**
 * @summary Get read-mode progress summary
 */
export declare const getSummary: (options?: Parameters<typeof customFetch>[1]) => Promise<LogbookSummary>;
export declare const getGetSummaryQueryKey: () => readonly ["/api/summary"];
export declare const getGetSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getSummary>>>;
export type GetSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get read-mode progress summary
 */
export declare function useGetSummary<TData = Awaited<ReturnType<typeof getSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map