import React from "react";
import RecipeCard from "../components/RecipeCard"
import HeroPanelWithBlurb from "../components/HeroPanelWithBlurb"

const Components = {
    heroPanelWithBlurb: HeroPanelWithBlurb,
    recipe: RecipeCard
  };
  
  export default (component, key, module) => {
    // component exists
    if (typeof Components[component] !== "undefined") {
      return React.createElement(Components[component], {
        key: key,
        module: module
      });
    }
    // component doesn't exist yet
    return React.createElement(
        () => <div>The component {component} has not been created yet.</div>,
        { key: key }
    );
  }