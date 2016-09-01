import 'isomorphic-fetch';

import { baseUrl } from '../config/appConfig';

const GET = 'GET';
const POST = 'POST';

function buildGET(url, endpoint) {
  return [`${url}${endpoint}`, { method: GET }];
}

function buildPOST(url, query) {
  const postUrl = `${url}${query.league}/${query.player}`;
  return [
    postUrl,
    {
      method: POST,
      body: query.playerName,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  ];
}

function checkStatus(response) {
  if (response.status < 200 && response.status > 300) {
    const error = new Error(response.status);
    error.response = response;
    return Promise.reject(error);
  }
  return response;
}

function callApi(url, query, method) {
  const [getUrl, options] = method === GET ? buildGET(url, query) : buildPOST(url, query);
  return (
    fetch(getUrl, options)
      .then(checkStatus)
      .then((response) => (
        response.json()
      ))
      .then(
        response => ({ response }),
        error => ({ error: error.message || 'Something bad happened' })
      )
  );
}

export const getAllPlayers = query => callApi(baseUrl, query, GET);
export const getAllLeagues = query => callApi(baseUrl, query, GET);
export const createPlayer = query => callApi(baseUrl, query, POST);
