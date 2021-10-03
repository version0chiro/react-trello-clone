import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { BOARDS, SIGN_IN } from '../../routes';
import { Spinner } from '../../shared/components/Spinner';
import { AuthUserContext } from './AuthUserContext';

export const withAuthentication = (Component) =>
    class WithAuthentication extends React.Component {
        state = {
            authUser: null,
        };

        componentDidMount() {
            firebase.auth().onAuthStateChanged((authUser) => {
                authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
            });
        }

        render() {
            const { authUser } = this.state;

            return (
                <AuthUserContext.Provider value={authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    };

export const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            firebase.auth().onAuthStateChanged((authUser) => {
                if (!authCondition(authUser)) {
                    this.props.history.push(SIGN_IN);
                }
            });
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {(authUser) => (authUser ? <Component {...this.props} /> : null)}
                </AuthUserContext.Consumer>
            );
        }
    }

    return withRouter(WithAuthorization);
};

export const withLandingAuthentication = (Component) => {
    const WithLandingAuthentication = (props) => {
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            setLoading(true);
            firebase.auth().onAuthStateChanged((authUser) => {
                setLoading(false);
                if (authUser) {
                    props.history.push(BOARDS);
                }
            });
        }, []);
        return loading ? <Spinner /> : <Component />;
    };

    return withRouter(WithLandingAuthentication);
};
