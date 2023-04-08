import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
  Table,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

interface P {
  events: any;
}

export const TimelineWidget = (props: P) => {
  let { events } = props;

  console.log("events", events);

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">Timeline</h5>
          </Col>
        </Row>
      </Card.Header>

      <Table responsive className="align-items-center table-flush">
        <tbody>
          {events.map((i: any, idx: number) => {
            return (
              <tr key={idx}>
                <td>
                  {i.title}
                  <i>
                    {i.title === "Inspection Ends" &&
                      " - Buyer pullout allowed before"}
                    {i.title === "Closing Date" &&
                      " - Arbitration flags allowed before"}
                    {i.title === "Free Funds Date" &&
                      " - Extension for response arbitration flag"}
                    {i.title === "Inspection Extension" &&
                      " - (For extending pullout deadline)"}
                  </i>
                </td>
                <td style={{ color: i.color }}>
                  <FontAwesomeIcon icon={faCircle} className="me-1" />
                </td>
                <td>{new Date(i.time).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/* </Card.Body> */}
    </Card>
  );
};
