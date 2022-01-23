import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Tab, ListGroup, Form, Button, Col, Badge } from "react-bootstrap";

function SubjectOverview({subjects}) {
    let navigate = useNavigate();

    const fontColor = (hex) => {
        if(hex) {
            const luminance = (0.2126 * parseInt(hex.slice(0,2),16) + 0.7152 * parseInt(hex.slice(2,4),16) + 0.0722 * parseInt(hex.slice(4,6), 16)) / 255;
            return luminance > 0.6 ? "black" : "white";
        } else {
            return "black";
        }
    }

    const subjectList = () => {
        return(
            <Container style={{marginBottom: "3rem"}}>
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                    <Row>
                        <Col xs={12} md={8} lg={8} style={{maxHeight: "20rem", overflowY: "auto"}}>
                            <ListGroup>
                            {
                                subjects.map((subject) => 
                                    <ListGroup.Item href={"#" + subject.id}>
                                        <span className="dot" style={{backgroundColor: "#" + subject.color}}></span>
                                        {subject.title}
                                    </ListGroup.Item>
                                )
                            }
                            </ListGroup>
                        </Col>
                        <Col xs={12} md={4} lg={4} style={{alignSelf: "center"}}>
                            <Tab.Content>
                                {
                                    subjects.map((subject) =>
                                        // determine font color (b/w) based on luminance of the subject color
                                        <Tab.Pane eventKey={"#" + subject.id} id={subject.id} style={{backgroundColor: "#" + subject.color, color: fontColor(subject.color)}} className="quickSubjectOverview">
                                            <strong>{subject.title}</strong>
                                            <br/>
                                            <em>{subject.description ? subject.description : null}</em>
                                            <br/>
                                            <u onClick={() => navigate(`/subjects/${subject.id}`)}>See more/ Edit Subject</u>
                                        </Tab.Pane>
                                    )
                                }
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        );
    }

    const noSubjects = () => {
        return(
            <Container style={{marginBottom: "2rem"}}>
                <Row>
                    <h1 style={{color: "grey", textAlign: "center"}}>No subjects found</h1>
                </Row>
            </Container>
        );
    }

    return(
        <div>
            {
                subjects && subjects.length > 0 ? subjectList() : noSubjects()
            }
        </div>
    );
}

export default SubjectOverview;