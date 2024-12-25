# Mock Circus

Mock Circus is a simple Fastify-based mock data generator that serves random data based on predefined routes and schemas specified in a YAML configuration file.

## Installation

1. Clone the repository:

    ```sh
    git clone <repository-url>
    cd mock-circus
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Configuration

The data generation is configured using a `circus.yml` file. Each entry in the YAML file defines a route, the number of entries to generate, and the schema for the data.

Example `circus.yml`:

```yaml
- route: /oil
  entries: 1000
  data:
      - month: date.month
        price: finance.amount

- route: /marketplacepnl
  data:
      - company: company.name
        stockMarketEvaluation: finance.amount
        timestamp: date.recent
```

## Usage

1. Start the server:

    ```sh
    npm start
    ```

2. Access the routes defined in `circus.yml`:
    - [http://localhost:3000/oil](http://localhost:3000/oil)
    - [http://localhost:3000/marketplacepnl](http://localhost:3000/marketplacepnl)

## How It Works

-   The server reads the `circus.yml` file to configure routes and data schemas.
-   For each route, it generates the specified number of entries using the Faker.js library.
-   The generated data is served as JSON when the route is accessed.

## Example

Accessing the `/oil` route might return:

```json
[
    {
        "month": "January",
        "price": "123.45"
    },
    ...
]
```

Accessing the `/marketplacepnl` route might return:

```json
[
    {
        "company": "Acme Corp",
        "stockMarketEvaluation": "678.90",
        "timestamp": "2023-10-01T12:34:56.789Z"
    },
    ...
]
```

## License

This project is licensed under the MIT License.
