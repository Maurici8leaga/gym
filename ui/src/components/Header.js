import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';
import { compose } from 'redux';
import '../components/scss/index.scss';


class Header extends Component {


  renderAuth() {

    const { signOut, isSignedIn } = this.props;

    if (isSignedIn) {
      return (
        <h2>
          <Link to="/profile" className="links-scss">
            <i className="fas fa-user-circle"></i>
          </Link>
          <Link to='/signin' onClick={() => signOut()} className="links-scss">
            <i className="fas fa-times"></i>          
          </Link>
        </h2>
      )
    } else {
      return (
        <h4>
          <ul>
            <li >
              <Link to="/signup" className="links-scss">Registrarme</Link>
            </li>

            <li >
              <Link to="/signin" className="links-scss" >Socios</Link>
            </li>
          </ul>
        </h4>
      )
    }
  }

  renderEjercicios() {
    if (this.props.isSignedIn) {
      return (
        <h1>
          <Link to="/routinesType" className="links-scss">
            <i className="fas fa-dumbbell"></i> Ludus Magnus
          </Link>
        </h1>
      );
    } else {
      return (
        <h1 className="button-icon-disable">
          <i className="fas fa-dumbbell"></i> Ludus Magnus
          {/* el texto debe ir fuera el "icon" de manera que el css que tenga el icon no se mescle con el del texto */}
        </h1>
      );
    }
  }

  render() {
    return (
      <nav className="header fondo-claro">
        <div>
          {this.renderEjercicios()}
        </div>
        <div>
          {this.renderAuth()}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
}


export default
  compose(
    connect(mapStateToProps, { signIn, signOut }),
    withRouter
  )(Header);