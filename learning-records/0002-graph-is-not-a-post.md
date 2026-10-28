# Graph is not a POST resource

Pietro asked to implement Graph, View, and Layout as if they were three sibling User CRUDs. The correction: Graph and the Default view are already inserted by the workspace nested write; Layout has no own id. Future sessions start from “View CRUD then PUT layouts,” not from inventing `POST /graphs`.
