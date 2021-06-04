import React from "react";
import { useState } from "react";
import { Button, Modal, Icon } from "semantic-ui-react";
import { mutate } from "swr";

import { api } from "../../api/api";

const RemoveMonitorModal = ({ name }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      centered={false}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Icon name="x" link color="red"></Icon>}
    >
      <Modal.Header>Remove {name}?</Modal.Header>
      <Modal.Content>
        Are you sure you want to remove this monitor?
      </Modal.Content>

      <Modal.Actions>
        <Button content="Cancel" onClick={() => setOpen(false)} negative />
        <Button
          type="submit"
          form="add-monitor-form"
          content="Delete"
          labelPosition="right"
          icon="x"
          positive
          onClick={async () => {
            await api
              .delete(`/monitors/${name}/`)
              .then(() => {
                mutate(`/monitors/`);
                mutate(`/uptime/`);
                mutate(`/globalstats/`);
                setOpen(false);
              })
              .catch((e) => console.log(e.message));
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default RemoveMonitorModal;
