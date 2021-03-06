import * as types from './action-types';

export function getAllLeagues(query) {
  return {
    type: types.GET_ALL_LEAGUES,
    query,
  };
}

export function getLeaguesSuccess(response) {
  return {
    type: types.GET_ALL_LEAGUES_SUCCESS,
    response,
  };
}

export function getLeaguesError(error) {
  return {
    type: types.GET_ALL_LEAGUES_ERROR,
    error,
  };
}
