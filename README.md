# GrubHub API thing

Simple GrubHub API to power a Zap workflow for a hackathon

### Available endpoints:

| Type | Path | Params | Description |
| --- | --- | --- | --- |
| `GET` | `/nearby_restaurants` | `address`: encoded string<br/>`food`: encoded string **(optional)** | Fetches the top 5 restaurants near the provided address, can <br/>be filtered by the optional "food" param.<br/><br/>Will 404 if an address is not provided. |
