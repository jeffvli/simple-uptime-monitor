import React from "react";
import { Grid, Item, Container, Popup, List, Icon } from "semantic-ui-react";
import { Chart } from "react-apexcharts";
import { ResponsiveLine } from "@nivo/line";
import { formatDistance } from "date-fns";

import RemoveMonitorModal from "./modals/RemoveMonitorModal";

const MonitorEntry = ({
  name,
  host,
  refreshInterval,
  lastResponse,
  updatedAt,
  uptime,
  alive,
}) => {
  return (
    <>
      <Grid>
        <Grid.Column width={1}>
          <Popup
            trigger={
              <div
                className={alive ? "status-icon green" : "status-icon red"}
              ></div>
            }
            content={
              <List>
                <List.Item>
                  <b>Refreshed:</b> {refreshInterval}
                </List.Item>
                <List.Item>
                  <b>Last Response Time:</b> {lastResponse.time + " sec"}
                </List.Item>
                <List.Item>
                  <b>Last Response Code:</b> {lastResponse.code}
                </List.Item>
              </List>
            }
            basic
          />
        </Grid.Column>
        <Grid.Column width={13}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header as="a">{name}</Item.Header>
                <Item.Meta>{host}</Item.Meta>
                <Item.Description></Item.Description>
                <Item.Extra>
                  {`Last checked: ${
                    updatedAt === "Never"
                      ? "Never"
                      : formatDistance(new Date(updatedAt), new Date(), {
                          addSuffix: true,
                        })
                  }`}
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={2}>
          <Container className="uptime-percentage">
            {`${(uptime * 100).toFixed(2)}%`}
          </Container>
          <Container className="remove-monitor">
            <RemoveMonitorModal name={name}></RemoveMonitorModal>
          </Container>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default MonitorEntry;
