import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';

const LoginButton = ({ handleClick }) => {
    return (
        <button className="loginButton" onClick={handleClick}>Login with Spotify</button>
    )
}

const LogoutButton = ({ handleClick, isLoggedIn }) => {
    if (isLoggedIn) {
        return (
            <Button onClick={handleClick} variant="outline-success">Logout</Button>
        )
    } else {
        return 
    }   
}

const Header = ({ isLoggedIn }) => {

    const handleLoginClick = () => {
        // Handle login click
    }

    const handleLogoutClick = () => {
        // Handle logout click
    }
    return (
        <Navbar className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">Lyra</Navbar.Brand>
            {/* Bouton Toggle pour afficher le contenu sur petits écrans */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Form>
                <LogoutButton isLoggedIn={isLoggedIn}/>
            </Form>
          </Container>
        </Navbar>
      );
}
export default Header;
// Header component to be used in the main App component