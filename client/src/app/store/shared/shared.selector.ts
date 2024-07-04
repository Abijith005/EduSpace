import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SharedState } from "./shared.state";

export const selectSharedState = createFeatureSelector<SharedState>('sharedDatas');
export const selectIsLoading = createSelector(
    selectSharedState,
    (state: SharedState) => state.isLoading
  );
