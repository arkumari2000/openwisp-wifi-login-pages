import {connect} from "react-redux";

import Component from "./registration";

const mapStateToProps = state => {
  return {
    registration: state.organization.configuration.components.registration_form,
    privacyPolicy: state.organization.configuration.privacy_policy,
    termsAndConditions: state.organization.configuration.terms_and_conditions,
    language: state.language,
    orgSlug: state.organization.configuration.slug,
  };
};

export default connect(
  mapStateToProps,
  null,
)(Component);