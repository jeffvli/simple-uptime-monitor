import React from "react";
import {
  Grid,
  Item,
  Button,
  Image,
  Icon,
  Placeholder,
  Container,
  Header,
  Statistic,
} from "semantic-ui-react";
import { Chart } from "react-apexcharts";
import { ResponsiveLine } from "@nivo/line";
import { formatDistance } from "date-fns";
const MonitorEntry = ({
  name,
  host,
  refreshInterval,
  updatedAt,
  uptime,
  alive,
}) => {
  return (
    <>
      <Grid>
        <Grid.Column width={1}>
          <div
            className={alive ? "status-icon green" : "status-icon red"}
          ></div>
        </Grid.Column>
        <Grid.Column width={13}>
          <Item>
            <Item.Content>
              <Item.Header as="a">{name}</Item.Header>
              <Item.Meta>{host}</Item.Meta>
              <Item.Description></Item.Description>
              <Item.Extra>
                {`Last Checked: ${
                  updatedAt === "Never"
                    ? "Never"
                    : formatDistance(new Date(updatedAt), new Date(), {
                        addSuffix: true,
                      })
                }`}
              </Item.Extra>
            </Item.Content>
          </Item>
        </Grid.Column>

        <Grid.Column width={2}>
          <Container className="uptime-percentage">
            {`${(uptime * 100).toFixed(2)}%`}
          </Container>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default MonitorEntry;
