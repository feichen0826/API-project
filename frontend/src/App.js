import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch,Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ViewGroupsList from "./components/ViewGroupsList";
import GroupDetailsPage from "./components/GroupDetailsPage";
import ViewEventsList from "./components/ViewEventsList"
import CreateGroupForm from "./components/CreateGroupForm";
import EditGroupForm from "./components/EditGroupForm";
import EventDetailPage from "./components/EventDetailPage"
import CreateEventForm from "./components/CreateEventForm";
import LandingPage from "./components/LandingPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path="/view-groups" component={ViewGroupsList} />
        <Route path="/view-events" component={ViewEventsList} />
        <Route path="/create-group" component={CreateGroupForm} />
        <Route path="/groups/:groupId/edit" component={EditGroupForm} />
        <Route path="/groups/:groupId" component={GroupDetailsPage} />
        {/* <Route path="/groups/:groupId/events/create" component={CreateEventForm} /> */}
        <Route path="/create-event/:groupId" component={CreateEventForm} />
        <Route path="/events/:eventId" component={EventDetailPage} />
      </Switch>
      }
    </>
  );
}

export default App;
