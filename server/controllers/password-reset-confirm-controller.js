import axios from "axios";
import merge from "deepmerge";
import qs from "qs";

import config from "../config.json";
import defaultConfig from "../utils/default-config";
import logInternalError from "../utils/log-internal-error";

const passwordResetConfirm = (req, res) => {
  const reqOrg = req.params.organization;
  const validSlug = config.some((org) => {
    if (org.slug === reqOrg) {
      // merge default config and custom config
      const conf = merge(defaultConfig, org);
      const {host} = conf;
      let resetConfirmUrl = conf.proxy_urls.password_reset_confirm;
      // replacing org_slug param with the slug
      resetConfirmUrl = resetConfirmUrl.replace("{org_slug}", org.slug);
      const timeout = conf.timeout * 1000;
      const {newPassword1, newPassword2, uid, token} = req.body;
      // make AJAX request
      axios({
        method: "post",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        url: `${host}${resetConfirmUrl}/`,
        timeout,
        data: qs.stringify({
          new_password1: newPassword1,
          new_password2: newPassword2,
          uid,
          token,
        }),
      })
        .then((response) => {
          // forward response
          res
            .status(response.status)
            .type("application/json")
            .send(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 500)
            logInternalError(error);
          // forward error
          try {
            res
              .status(error.response.status)
              .type("application/json")
              .send(error.response.data);
          } catch (err) {
            logInternalError(error);
            res.status(500).type("application/json").send({
              detail: "Internal server error",
            });
          }
        });
    }
    return org.slug === reqOrg;
  });
  // return 404 for invalid organization slug or org not listed in config
  if (!validSlug) {
    res.status(404).type("application/json").send({
      detail: "Not found.",
    });
  }
};

export default passwordResetConfirm;
