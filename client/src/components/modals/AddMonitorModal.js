import React from "react";
import { useState } from "react";
import { Button, Modal, Message, Menu } from "semantic-ui-react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Form, Input, Select } from "formik-semantic-ui-react";
import { mutate } from "swr";

import { api } from "../../api/api";

const AddMonitorModal = () => {
  const [open, setOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const initialFormValue = {
    monitorName: "",
    hostName: "",
    refreshInterval: 60,
  };

  const validationScheme = Yup.object({
    monitorName: Yup.string()
      .matches(
        /^[a-z0-9]+$/i,
        "The name of the monitor must consist of only alphanumeric characters [/^[a-z0-9]+$/i]"
      )
      .max(64, "Must be 64 characters or less")
      .required("Required"),
    hostName: Yup.string()
      .matches(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm,
        "Requires a valid 'http(s)://<URL>.com' format"
      )
      .max(512, "Must be 512 characters or less")
      .required("Required"),
  });

  const refreshOptions = [
    { key: "60", value: 60, text: "1 minute" },
    { key: "300", value: 300, text: "5 minutes" },
    { key: "900", value: 900, text: "15 minutes" },
  ];

  return (
    <Modal
      centered={false}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Menu.Item name="Add Monitor"></Menu.Item>}
    >
      <Modal.Header>Add monitor</Modal.Header>
      <Formik
        id="add-monitor-form"
        initialValues={initialFormValue}
        validationSchema={validationScheme}
        onSubmit={async (values) => {
          await api
            .post(`/monitors/`, {
              name: values.monitorName,
              host: values.hostName,
              refresh_interval: values.refreshInterval,
            })
            .then(() => {
              api.post(`/status/?name=${values.monitorName}`);
            })
            .then(() => {
              mutate(`/monitors/`);
              mutate(`/uptime/`);
              mutate(`/globalstats/`);
              setOpen(false);
            })
            .catch((e) => setSubmissionError(e.message));
        }}
      >
        <Modal.Content>
          <Form id="add-monitor-form" size="large">
            <Input
              id="input-monitor-name"
              errorPrompt
              errorConfig={{
                prompt: false,
                basic: false,
                color: "green",
              }}
              name="monitorName"
              label="Name"
              placeholder="Blog"
              autoFocus
            />
            <Input
              id="input-monitor-hostname"
              errorPrompt
              errorConfig={{
                prompt: false,
                basic: true,
                color: "blue",
              }}
              name="hostName"
              label="Host Name"
              placeholder="https://myblog.com/"
            />

            <Select
              id="select-monitor-refreshinterval"
              name="refreshInterval"
              label="Refresh Interval"
              placeholder="Select your refresh interval"
              options={refreshOptions}
            ></Select>
          </Form>
          {submissionError && (
            <Message
              error
              header="There were errors during submission"
              list={[submissionError]}
            />
          )}
        </Modal.Content>
      </Formik>

      <Modal.Actions>
        <Button content="Cancel" onClick={() => setOpen(false)} negative />
        <Button
          type="submit"
          form="add-monitor-form"
          content="Submit"
          labelPosition="right"
          icon="checkmark"
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddMonitorModal;
