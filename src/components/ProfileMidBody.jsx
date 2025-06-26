import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { Button, Col, Image, Nav, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePostCard from './ProfilePostCard';
import { fetchPostsByUser } from '../features/posts/postsSlice';

export default function ProfileMidBody() {
    const url = "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
    const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

    const dispatch = useDispatch();
    const posts = useSelector(store => store.posts.posts);
    const loading = useSelector(store => store.posts.loading);

    useEffect(() => {
        const token = localStorage.getItem("authToken"); // grabbing token from localStorage
        if (token) { // verifying the token
            const decodedToken = jwtDecode(token); // decoding token that grabbed from localStorage
            const userId = decodedToken.id;
            dispatch(fetchPostsByUser(userId));
        }
    }, []);

    return (
        <Col sm={6} className="be-light" style={{ border: "1px solid lightgrey" }}>
            <Image src={url} fluid />
            <br />
            <Image
                src={pic}
                roundedCircle
                style={{
                    width: 150,
                    position: "absolute",
                    top: "140px",
                    border: "4px solid #F8F9FA",
                    marginLeft: 15,
                }}
            />

            <Row className="justify-content-end">
                <Col xs="auto">
                    <Button className="rounded-pill mt-2" variant="outline-secondary">
                        Edit Profile
                    </Button>
                </Col>
            </Row>

            <p className="mt-5" style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
                Haris
            </p>

            <p style={{ marginBottom: "2px" }}>@haris.samingan</p>

            <p>I help people switch careers to be a software developer at sigmaschool.co</p>

            <p>Entrepreneur</p>

            <p>
                <strong>271</strong> Following <strong>610</strong> Followers
            </p>

            <Nav variant='underline' defaultActiveKey="/home" justify>
                <Nav.Item>
                    <Nav.Link eventKey="/home">Tweets</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Replies</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Highlights</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-3">Media</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-4">Likes</Nav.Link>
                </Nav.Item>
            </Nav>
            {loading && (
                <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
            )}
            {posts.length > 0 ? posts.map((post) => (
                <ProfilePostCard key={post.id} content={post.content} postId={post.id} />
            )) : <p>No posts yet</p>}
        </Col>
    )
}