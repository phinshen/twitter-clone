import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";

export default function NewPostModal({ show, handleClose }) {
    const [postContent, setPostContent] = useState("");

    const handleSave = () => {
        // getting stored JWT token
        const token = localStorage.getItem("authToken");

        // decode the token to fetch user id
        const decode = jwtDecode(token);
        const userId = decode.id;

        // prepare data to be sent
        const data = {
            title: "Post Title", // add functionality to set this properly
            content: postContent,
            user_id: userId,
        };

        axios
            .post("https://bf5cd2b3-e25e-405b-88ca-5f3ad24fded2-00-38g012z3zpyd5.sisko.replit.dev/posts", data)
            .then((response) => {
                console.log("Success:", response.data)
                handleClose();
            })
            .catch((error) => {
                console.error("Error", error);
            });

    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control placeholder="What is happening?"
                                as="textarea"
                                rows={3}
                                onChange={(event) => setPostContent(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={handleSave}
                    >
                        Tweet
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}