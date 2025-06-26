import { Card, Form } from 'react-bootstrap';

export default function SearchBar({ query, setQuery }) {
    console.log("Current query:", query);

    return (
        <Card className="p-3 mb-3">
            <Form>
                <Form.Control
                    type="text"
                    value={query}
                    placeholder="Search Bar"
                    onChange={(event) => setQuery(event.target.value)}
                />
            </Form>
        </Card>
    )
}
