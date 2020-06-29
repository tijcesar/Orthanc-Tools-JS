import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import ToolsPanel from './ToolsPanel'
import apis from '../../services/apis'
import {
  Switch,
  Route,
  withRouter, 
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import { TransitionGroup, CSSTransition } from "react-transition-group";

import Query from '../Query/Components/Query'
import AutoQueryRoot from '../AutoQuery/Component/AutoQueryRoot'
import RobotView from '../AutoQuery/Component/RobotView'
import Authentication from '../Authentication'
import AdminRootPanel from '../Admin/AdminRootPanel'
import Import from '../Import/Import'
import ContentRootPanel from '../OrthancContent/ContentRootPanel'
import ExportPanel from '../Export/ExportPanel'
import AnonRootPanel from '../Anonymize/AnonRootPanel'

import { resetReducer } from '../../actions/LogOut'
import { saveUsername } from '../../actions/Username'
import { connect } from 'react-redux'

class NavBar extends Component {

  state  = {
    navBackground : '#11ffee00',
    token: {}
  }

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }
  
  
  async logout(){
    this.props.resetReducer() //empty all reducer
    document.cookie = 'tokenOrthancJs=undefined' //change value of the cookie to delete the token
    await apis.authentication.logOut() //do nothing (need to modify in back to increase security)
  
  }

  async componentDidMount(){
    this.setState({
      sizeScreen: document.documentElement.clientWidth
    })
    document.addEventListener("scroll", () => {
      const backgroundcolor = window.scrollY < 50 ? "#11ffee00" : "#0275d8";

      this.setState({ navBackground: backgroundcolor });
    });

    let token = await apis.token.decodeCookie()
    this.props.saveUsername(token.username)
    this.setState({token: token})
  }

  AnimatedSwitch = withRouter(({location}) => (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames={location.pathname === '/' ? 'auth' : 'slide'} timeout={500} onEnter={() => this.props.setLocation(location.pathname)}>
        <Switch location={location}>
          <Route exact path='/' component={Authentication} />
          <Route exact path='/import' component={Import} />
          <Route exact path='/query' component={Query} />
          <Route exact path='/auto-query' component={AutoQueryRoot} />
          <Route exact path='/options' component={AdminRootPanel} />
          <Route exact path='/orthanc-content' component={ContentRootPanel} />
          <Route exact path='/robot/:username' render = { (props) => <RobotView username={props.match.params.username} /> } />
          <Route exact path='/export' component={ExportPanel} />
          <Route exact path='/anonymize' component={AnonRootPanel} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
))


  navBarResponsive = () => {
    return (
      <Fragment>
        <Navbar fixed='top' collapseOnSelect expand='lg' bg='dark' variant='dark'>
            <Navbar.Toggle aria-controls='responsive_navbar' />
            <Navbar.Collapse id='responsive_navbvar'>
              <Nav className='float-right mr-3'>
                <ToolsPanel roles={this.state.token} apercu={false}/>
              </Nav>
              <Nav className='mr-auto'>
                <Link className='nav-link' to='/orthanc-content' hidden={!this.state.token.content}>Orthanc Content</Link>
                <Link className='nav-link' to='/import' hidden={this.state.token.import}>Import</Link>
                <Link className='nav-link' to='/query' hidden={!this.state.token.query}>Query</Link>
                <Link className='nav-link' to='/auto-query' hidden={!this.state.token.auto_query}>Auto-Retrieve</Link>
                <Link className='nav-link' to='/options' hidden={!this.state.token.admin}>Administration</Link>
                <Link className='nav-link' onClick={this.logout} to='/'>Log out</Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          {<this.AnimatedSwitch />}
      </Fragment>
    )
  }

  navbarClassique = ()  => {
    return (
      <Fragment>
        <nav className='navbar navbar-expand-lg mb-5 fixed-top' style={ {backgroundColor : this.state.navBackground} } >
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link className='nav-link' to='/orthanc-content' hidden={!this.state.token.content}>Orthanc Content</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/import' hidden={this.state.token.import}>Import</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/query' hidden={!this.state.token.query}>Query</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/auto-query' hidden={!this.state.token.auto_query}>Auto-Retrieve</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/options' hidden={!this.state.token.admin}>Administration</Link>
            </li>
            <li className='nav-item float-right'>
              <Link className='nav-link' onClick={this.logout} to='/'>Log out</Link>
            </li>
          </ul>
          <ToolsPanel roles={this.state.token} apercu={true}/>
        </nav>
        {<this.AnimatedSwitch />}
      </Fragment>
    )
  }
  

  render () {
    return (
      
        this.state.sizeScreen < 970 ? <this.navBarResponsive/> : <this.navbarClassique/>
      
    )
  }
  
}

const mapsDispatchToProps = {
  resetReducer, 
  saveUsername
}

export default connect(null, mapsDispatchToProps)(NavBar)

