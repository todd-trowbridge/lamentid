import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { Button, Container, Form, Row, Card } from 'react-bootstrap'
import "./index.css"


export default function NewProject() {
    const [projectName, setProjectName] = useState("");
    const [error, setError] = useState("");
    const [keywords, setKeywords] = useState([{
        searchTerm: "",
        subreddit: ""
    }]);
    const history = useHistory();


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/api/v1/projects/new", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: projectName,
                keywords: keywords
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error)
                } else {
                    history.push("/dashboard")
                }
            })
    }

    const updateKeyword = (index, key, value) => {
        const newKeywords = [...keywords];
        newKeywords[index][key] = value;
        setKeywords(newKeywords)
    }

    //? add button to add rows and add new object to state
    const addNewKeywords = () => {
        setKeywords([...keywords, {
            searchTerm: "",
            subreddit: ""
        }])
    }

    return (
        <Container className="newProjectForm">
            {error && (<div>{error}</div>)}
          <Card>
              <Card.Body>
                <Form>
                    <Form.Group
                        onSubmit={handleSubmit}
                        className="newProject">
                        <Form.Label>Project Name:</Form.Label>
                        <Form.Control
                            value={projectName}
                            name="keywords"
                            onChange={(e) => setProjectName(e.target.value)}
                            type="text"
                            maxLength="100" />

                        {keywords.map((keyword, index) => {
                            return (

                                <Container key={index}>
                                    <Form.Label for="keywords">Keyword:</Form.Label>
                                    <Form.Control
                                        value={keyword.searchTerm}
                                        onChange={(e) => updateKeyword(index, "searchTerm", e.target.value)}
                                        name="keywords"
                                        type="text"
                                        maxLength="100" />
                                    <Form.Label for="subreddit">Subreddit:</Form.Label>
                                    <Form.Control
                                        value={keyword.subreddit}
                                        onChange={(e) => updateKeyword(index, "subreddit", e.target.value)}
                                        name="subreddit"
                                        type="text"
                                        maxLength="100" />
                            </Container>
                                       
                    )
                })}
                    <Container className="buttons">
                        <Button variant="warning" onClick={addNewKeywords}>+</Button>
                        <Button variant="primary" type="submit">Save Project</Button>
                    </Container>
                </Form.Group>
            </Form>
            </Card.Body>
              </Card>
        </Container>
    )
}
