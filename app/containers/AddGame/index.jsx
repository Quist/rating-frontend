/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* global Materialize */

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddGameCard from '../../components/AddGameCard';
import * as CreateGameActions from './actions';
import * as PlayerActions from '../Ranking/actions';
import { leagueName } from '../../config/appConfig';

const propTypes = {
  playerActions: PropTypes.object,
  createGameActions: PropTypes.object,
  players: PropTypes.array,
  addGame: PropTypes.object,
  changeWhitePlayer: PropTypes.object,
  changeBlackPlayer: PropTypes.object,
  changeWinner: PropTypes.object,
};

class AddGame extends React.Component {
  constructor() {
    super();
    this.onBlackChange = this.onBlackChange.bind(this);
    this.onWhiteChange = this.onWhiteChange.bind(this);
    this.onWinnerChange = this.onWinnerChange.bind(this);
    this.onSubmitButton = this.onSubmitButton.bind(this);
  }

  componentWillMount() {
    this.fetchPlayers();
  }

  onBlackChange(e) {
    this.props.createGameActions.changeBlackPlayer({
      selectedBlackPlayer: this.idToPlayer(e.target.value),
    });
  }

  onWhiteChange(e) {
    this.props.createGameActions.changeWhitePlayer({
      selectedWhitePlayer: this.idToPlayer(e.target.value),
    });
  }

  onWinnerChange(e) {
    this.props.createGameActions.changeWinner({
      result: e.target.value,
    });
  }

  onSubmitButton() {
    const white = this.props.addGame.selectedWhitePlayer._id;
    const black = this.props.addGame.selectedBlackPlayer._id;
    if (!this.props.addGame.result) {
      Materialize.toast('Please set the result', 4000, 'red');
    } else {
      const winner = this.props.addGame.result;
      let gameResult;
      if (winner === 'white') {
        gameResult = '1-0';
      } else if (winner === 'black') {
        gameResult = '0-1';
      } else {
        gameResult = '0-0';
      }
      const query = {
        league: leagueName,
        endpoint: 'games',
        body: {
          whiteId: white,
          blackId: black,
          result: gameResult,
        },
      };

      this.props.createGameActions.addGame(query);
    }
  }

  idToPlayer(id) {
    return this.props.players.find((player) => (
      player._id === id
    ));
  }

  fetchPlayers() {
    this.props.playerActions.getAllPlayers(`${leagueName}/players`);
  }

  render() {
    return (
      <div>
        <AddGameCard
          whiteChange={this.onWhiteChange}
          blackChange={this.onBlackChange}
          winnerChange={this.onWinnerChange}
          handleSubmit={this.onSubmitButton}
          players={this.props.players}
          whitePlayer={this.props.addGame.selectedWhitePlayer}
          blackPlayer={this.props.addGame.selectedBlackPlayer}
        />
      </div>
    );
  }
}

AddGame.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    players: state.players.players,
    addGame: state.addGame,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    playerActions: bindActionCreators(PlayerActions, dispatch),
    createGameActions: bindActionCreators(CreateGameActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddGame);
