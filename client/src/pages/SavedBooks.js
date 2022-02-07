import React, { useState } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const [refetchData, setRefetchData] = useState(true);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  const { loading, data, refetch } = useQuery(QUERY_ME, {
    refetchOnMount: "always",
    force: true,
  });
  const userData = data?.me || {savedBooks: []};

  // refetch the data if required (first render and after delete)
  if (refetchData) {
    setRefetchData(!refetchData);
    refetch();
  }

  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await removeBook({ variables: { bookId: bookId } });
      removeBookId(bookId);
    } catch (error) {
      console.log(error);
    }
    setRefetchData(true);
  };
  if (loading) {
    return (
      <>
        <Jumbotron fluid className="text-light bg-dark">
          <Container>
            <h1>Viewing saved books!</h1>
          </Container>
        </Jumbotron>

        <h2>loading Data</h2>
      </>
    );
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>

        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                  {book.link ? (
                    <Button
                      className="btn-block btn-info"
                      href={book.link}
                      rel="noopener"
                      target="_blank"
                    >
                      More Information
                    </Button>
                  ) : null}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
