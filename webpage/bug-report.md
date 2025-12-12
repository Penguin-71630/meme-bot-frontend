# Bug Report File


## 2025/12/13 00:33

Trying to delete an alias from a image, but got error "500 Internal Server Error". 

Using uptrace and here's the log message:
```
{
  "id": 0,
  "groupId": "9814518078643611785",
  "system": "log:error",
  "name": "exception",
  "displayName": "github.com/uptrace/bun/driver/pgdriver.Error: ERROR: syntax error at or near \")\" (SQLSTATE=42601)",
  "time": "2025-12-12T16:31:55.153Z",
  "attrs": {
    "service_name": "go2025-backend",
    "service_version": "v0.0.1",
    "telemetry_sdk_language": "go",
    "telemetry_sdk_name": "opentelemetry",
    "exception_param_SQLSTATE": "42601",
    "exception_type": "github.com/uptrace/bun/driver/pgdriver.Error",
    "otel_library_name": "github.com/uptrace/bun",
    "telemetry_sdk_version": "1.38.0",
    "exception_param_log_severity": "ERROR",
    "host_name": "7d8c05cf36bb",
    "log_severity": "ERROR"
  }
}
```



## 2025/12/12 23:41 

getting 401 when trying to access backend API `GET /api/aliases` right after start up of docker compose, but after 1 ~ 2 minutes, it's ok.

Log message:
```
backend-1  | {"level":"info","ts":1765553837.4421663,"caller":"middlewares/accessLog.go:13","msg":"POST /auth/gen-login-url"}
backend-1  | {"level":"info","ts":1765553839.3232543,"caller":"middlewares/accessLog.go:13","msg":"OPTIONS /*any"}
backend-1  | {"level":"info","ts":1765553839.323296,"caller":"middlewares/accessLog.go:13","msg":"OPTIONS /*any"}
backend-1  | {"level":"info","ts":1765553839.3233085,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"warn","ts":1765553839.3233905,"caller":"middlewares/errorHandler.go:78","msg":"user did not login","error":"http: named cookie not present"}
backend-1  | {"level":"info","ts":1765553839.324581,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"warn","ts":1765553839.3246245,"caller":"middlewares/errorHandler.go:78","msg":"user did not login","error":"http: named cookie not present"}
backend-1  | {"level":"info","ts":1765553839.3252084,"caller":"middlewares/accessLog.go:13","msg":"POST /auth/login"}
backend-1  | {"level":"info","ts":1765553839.325493,"caller":"middlewares/accessLog.go:13","msg":"POST /auth/login"}
backend-1  | {"level":"info","ts":1765553839.3793862,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"info","ts":1765553839.3855033,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"info","ts":1765553872.7971,"caller":"middlewares/accessLog.go:13","msg":"POST /auth/login"}
backend-1  | {"level":"info","ts":1765553872.842072,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"info","ts":1765553905.793059,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"info","ts":1765553905.7976384,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"info","ts":1765553905.7985706,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
backend-1  | {"level":"info","ts":1765553905.7997246,"caller":"middlewares/accessLog.go:13","msg":"GET /api/aliases"}
```

I suspect it's the race condition happening at App.tsx (conflicts between "login" and "fetch aliases").  Please investigate the possible issue.

<!-- check if all other useEffect() are conflicting with the initial login process (getting cookie from backend) -->


## 2025/12/12 23:14


When I tried to delete an alias from a image, I got err "500 Internal Server Error". Log message:
```
:8080/api/image/2/aliases:1 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
api.ts:114 
 PUT http://localhost:8080/api/image/2/aliases 500 (Internal Server Error)
updateImageAliases	@	api.ts:114
handleSaveImage	@	App.tsx:101
handleSave	@	ImageModal.tsx:48
```

When an image is deleted, the alias entries at side barand buttons "previous page" and "next page" at top & bottom of main region of webpage are not updated synchronously.




## 2025/12/12 22:54

The aliases handling mechanism seems to have some bugs:
I test with single image huh.png, added 16 testing aliases: ["huh", "what", "huh2", "huh3", 4, 5, 6, 7, 8, 9, 0, 1, 2, 3].
- The side bar's numbering at page 1 isn't correct, it should be `#1, #2, #3, #4, #5`, but it's `#1, #3, #5, #6, #7`. Page 2, 3 are correct.
- There are more than 5 alias rows at the main region of webpage, and the alias string at each row is wrong.
    - Page 1: `4, huh2, huh3, Alias #8, Alias #9, Alias #10, Alias #11, Alias #12, Alias #13, Alias #14, Alias #15, Alias #16`
    - Page 2: `5, 6, 7, 8, 9, Alias #5, Alias #6, Alias #7, Alias #13, Alias #14, Alias #15, Alias #16`
    - Page 3: `0, 1, 2, 3, Alias #5, Alias #6, Alias #7, Alias #8, Alias #9, Alias #10, Alias #11, Alias #12`
It seems I didn't modify the pagination mechanism correctly (originally you implemented 5 aliases per page, but I want it to be 10 aliases per page).




## 2025/12/12 22:01

It seems there is a permission issue when backend tried to run `make swagger`.

```
make                              280ms  Fri Dec 12 22:00:30 2025
go run github.com/swaggo/swag/cmd/swag@v1.16.4 fmt
go run github.com/swaggo/swag/cmd/swag@v1.16.4 init -o docs -g cmds/serve.go -pdl 1
2025/12/12 22:00:34 Generate swagger docs....
2025/12/12 22:00:34 Generate general API Info, search dir:./
2025/12/12 22:00:34 pkg /Users/polarbear03617/Documents/交大/大三上/Go程式設計/backend/cmds cannot find all dependencies, <nil>
go: writing stat cache: open /Users/polarbear03617/go/pkg/mod/cache/download/github.com/go-resty/resty/v2/@v/v2.17.0.info640656495.tmp: permission denied
exit status 1
make: *** [swagger] Error 1
```




## 2025/12/11 12:42

I correctly access the backend API with the cookie provided by backend, but why do I still see this error:
Failed to load resource: the server responded with a status of 401 (Unauthorized)  (Login and seeing webpage is ok, but can't fetch aliases)






