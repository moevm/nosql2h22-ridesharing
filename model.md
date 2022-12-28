# Ridesharing. Модель данных
# Нереляционная модель данных (Neo4j)

## Графическое представление

![Графическое представление нереляционной модели данных](https://user-images.githubusercontent.com/25483308/209450218-b8ff4dae-3d77-42f3-9ab2-9f07632f69a3.png)

## Описание назначений коллекций, типов данных и сущностей

- Узел USER - представляет сущность пользователя
- Узел RIDE - представляет сущность поездки

## Оценка удельного объема информации, хранимой в модели (сколько потребуется памяти, чтобы сохранить объекты, как объем зависит от количества объектов)

### Узел USER
У узла есть следующие атрибуты:
* username: String - $V_un$ = 2b * 30 = 60b
* id: String - $V_id$ = 2b * 30 = 60b
* passowrd: String - $V_p$ = 2b * 30 = 60b
* isAuthorized: boolean - $V_isAu$ = 1b
* isAdmin: boolean - $V_isAd$ = 1b

Суммарный объем памяти, занимаемый одним узлом USER:

${V_u = 60b + 60b + 60b + 1b + 1b = 182b}$

### Узел RIDE
У узла есть следующие атрибуты:
* date: String - $V_d$ = 2b * 30 = 60b
* from: String - $V_f$ = 2b * 60 = 120b
* to: String - $V_t$ = 2b * 60 = 120b
* title: String - $V_ti$ = 2b * 30 = 60b
* price: short - $V_s$ = 2b
* statusHistory: [String] - $V_sh$ = 2b * 60 * 10 = 1200b (если предположить что есть 10 записей длинной в 60 символов)
* maxPassengers: short - $V_mp$ = 2b
* id: String - $V_id$ = 2b * 30 = 60b

Суммарный объем памяти, занимаемый одним узлом RIDE:

${V_r = 60b + 120b + 120b + 60b + 2b + 1200b + 2b + 60b = 1624b}$

### Есть следующие связи:
* RELATES с узлом RIDE - $V_rel$ = 1b + 1b + 1b = 3b


## Избыточность модели (отношение между фактическим объемом модели и “чистым” объемом данных).

Пусть:
- W - число пользователей;
- Z - число связей;
- X - число поездок;


**"Чистый" объем данных**:

$V_{чист} = W * 182b + X * 1624b$

При W = 300, Z = 1200, X = 200, количество данных, занимаемой "чистыми" данными = 54600 + 324800 = 379400
**Фактический объем данных для модели Neo4j**:

$V_{факт} = W * 182b + X * 1624 + Z * 3b$

При W = 300, Z = 1200, X = 200, количество данных, занимаемой "фактическими" данными = 54600 + 324800 + 3600 = 382800

$\frac{V_{факт}}{V_{чист}} = 1.01$

## Запросы к модели, с помощью которых реализуются сценарии использования

1. Добавление пользователя

```
CREATE (a:USER {id: $id, username: $username, password: $password, isAuthorized: $isAuthorized,
          isAdmin: $isAdmin }) RETURN a
```

2. Редактирование информации о пользователе

```
MATCH(
    user: USER {
        id: "234682637"
    }
)
SET user.username = "kopito",
    user.password = "123456"
```

3. Получение всех пользователей

```
MATCH(user: USER) RETURN user
```

4. Получение количества всех пользователей
```
MATCH (u: USER) RETURN count(u)
```

5. Удаление пользователя
```
MATCH (
    user: USER {id: used_id}
) DELETE user
```

6. Удаление пользователя и его связей
```
MATCH (u: USER {id: user_id})
-[edge:RELATES] 
-(r: RIDE) 
DELETE edge
DELETE u
```

7. Авторизация
```
MATCH(u : USER {username: $username, password: $password }) SET u.isAuthorized = $authorized RETURN u
```

8. Выход из системы
```
MATCH(u : USER {username: $username}) SET u.isAuthorized = $authorized RETURN u
```

9. Создание поездки  пользователя
```
MATCH (u: USER {username: $username}) CREATE (u)-[r: RELATES {isDriver: $isDriver,
          isFuture: $isFuture, isSure: $isSure}]->
          (:RIDE { id: $id, date: $date, from: $from, to: $to, title: $title,
          price: $price, statusHistory: $statusHistory, maxPassengers: $maxPassengers });
```

10. Получение всех поездок пользователя (c пагинацией)
```
MATCH (u: USER {username: $username}) -[edge:RELATES] - (r: RIDE) RETURN  r, edge
          ORDER BY r.id SKIP (page_no - 1) * MAX_PAGE_SIZE LIMIT MAX_PAGE_SIZE
```

11. Получение всех поездок приложения (с пагинацией)
```
MATCH (r:RIDE) RETURN r ORDER by r.id SKIP (page_no - 1) * MAX_PAGE_SIZE LIMIT MAX_PAGE_SIZE
```

12. Получение всех пользователей с поездками с заданным направлением (c пагинацией)
```
MATCH (u: USER) -[edge:RELATES] -(r: RIDE {from: from, to: to})
RETURN u
ORDER BY u.id
SKIP (page_no - 1) * MAX_PAGE_SIZE
LIMIT MAX_PAGE_SIZE
```

13. Добавление пользователя в поездку
```
MATCH (u: USER {id: user_id})
MATCH (r: RIDE {id: ride_id})
CREATE (u)-[:RELATES {isDriver: false, isFuture: true, isSure: true}]->(r)
RETURN u
```

14. Получение прошлых поездок пользователя
```
MATCH (u: USER {id: user_id})
-[edge:RELATES {isFuture: false}] 
-(r: RIDE) 
RETURN r
ORDER BY r.id
SKIP (page_no - 1) * MAX_PAGE_SIZE
LIMIT MAX_PAGE_SIZE
```

15. Получение количества прошлых поездок
```
MATCH (u: USER {id: user_id})
-[edge:RELATES {isFuture: false}] 
-(r: RIDE) 
RETURN count(r)
```

16. Удаление пользователя из поездки
```
MATCH (u: USER {id: user_id})
-[edge:RELATES]
-(r: RIDE {id: ride_id})
DELETE edge
```

17. Удаление поездки без связей

```
MATCH (r: RIDE {id: ride_id})
DELETE r
```

18. Удаление поездки и ее связей
```
MATCH (u: USER)
-[edge:RELATES] 
-(r: RIDE {id: ride_id}) 
DELETE edge
DELETE r
```


19. Удаление пользователя из всех поездок
```
MATCH (u: USER {id: user_id})
-[edge:RELATES] 
-(r: RIDE) 
DELETE edge
```

20. Удаление всех пользователей из поездки
```
MATCH (u: USER)
-[edge:RELATES] 
-(r: RIDE {id: ride_id}) 
DELETE edge
```

# Реляционная модель данных (SQL)

## Графическое представление

![Графическое представление реляционной модели данных](https://user-images.githubusercontent.com/64148875/209462076-4bd81409-49b6-4b82-bf41-1cab5d0ccd9d.png)

## Описание назначений коллекций, типов данных и сущностей

- Таблица USER - таблица пользователей
- Таблица RIDE - таблица поездок
- Таблица isDriver - вспомогательная таблица для обеспечения связи многие ко многим по одному из свойств
- Таблица isFuture - вспомогательная таблица для обеспечения связи многие ко многим по одному из свойств
- Таблица isSure - вспомогательная таблица для обеспечения связи многие ко многим по одному из свойств
- Таблица statusHisroty - вспомогательная таблица для хранения массива строк

## Оценка удельного объема информации, хранимой в модели (сколько потребуется памяти, чтобы сохранить объекты, как объем зависит от количества объектов)

### Таблица USER

Данная таблица имеет следующие поля:

- userId - UNSIGNED INT - $V_{userId}$ = 4b
- isDriverId - UNSIGNED INT - $V_{isDId}$ = 4b
- isFutureId - UNSIGNED INT - $V_{isFId}$ = 4b
- isSureId - UNSIGNED INT - $V_{isSId}$ = 4b
- username - VARCHAR(30) - ${V_{u} = 30b}$
- id - VARCHAR(30) - ${V_{id} = 30b}
- password - VARCHAR(30) - ${V_{p} = 30b}
- isAuthorized - BOOLEAN - ${V_{isAu} = 1b}
- isAdmin - BOOLEAN - ${V_{isAd} = 1b}


Суммарный объем памяти, занимаемый одной строкой в таблице USER:

$\sum_{x}^y$ = 4b + 4b + 4b + 4b + 30b + 30b + 30b + 1b + 1b = 108b

### Таблица RIDE

Данная таблица имеет следующие поля:

- rideId - UNSIGNED INT - $V_{rideId}$ = 4b
- isDriverId - UNSIGNED INT - $V_{isDId}$ = 4b
- isFutureId - UNSIGNED INT - $V_{isFId}$ = 4b
- isSureId - UNSIGNED INT - $V_{isSId}$ = 4b
- statusHistoryId - UNSIGNED INT - $V_{sHId}$ = 4b
- date - VARCHAR(30) - ${V_{d} = 30b}$
- from - VARCHAR(60) - ${V_{from} = 60b}$
- to - VARCHAR(60) - ${V_{to} = 60b}$
- title - VARCHAR(30) - ${V_{t} = 30b}$
- price - SMALLINT - ${V_{p} = 2b}$
- maxPassangers - SMALLINT - ${V_{mP} = 2b}$
- id - VARCHAR(30) - ${V_{id} = 30b}

Суммарный объем памяти, занимаемый одной строкой в таблице RIDE:

$\sum_{x}^y$ = 4b + 4b + 4b + 4b + 4b + 30b + 60b + 60b + 30b + 2b + 2b + 30b = 234b

### Таблица isDriver

Данная таблица имеет следующие поля:

- isDriverId - UNSIGNED INT - $V_{isDId}$ = 4b
- rideId - UNSIGNED INT - $V_{rideId}$ = 4b
- userId - UNSIGNED INT - $V_{userId}$ = 4b

Суммарный объем памяти, занимаемый одной строкой в таблице isDriver:

$\sum_{x}^y$ = 4b + 4b + 4b = 12b

### Таблица isFuture

Данная таблица имеет следующие поля:

- isFutureId - UNSIGNED INT - $V_{isFId}$ = 4b
- rideId - UNSIGNED INT - $V_{rideId}$ = 4b
- userId - UNSIGNED INT - $V_{userId}$ = 4b

Суммарный объем памяти, занимаемый одной строкой в таблице isFuture:

$\sum_{x}^y$ = 4b + 4b + 4b = 12b

### Таблица isSure

Данная таблица имеет следующие поля:

- isSureId - UNSIGNED INT - $V_{isSId}$ = 4b
- rideId - UNSIGNED INT - $V_{rideId}$ = 4b
- userId - UNSIGNED INT - $V_{userId}$ = 4b

Суммарный объем памяти, занимаемый одной строкой в таблице isSure:

$\sum_{x}^y$ = 4b + 4b + 4b = 12b

### Таблица statusHistory

Данная таблица имеет следующие поля:

- statusHistoryId - UNSIGNED INT - $V_{sHId}$ = 4b
- rideId - UNSIGNED INT - $V_{rideId}$ = 4b
- data - VARCHAR(30) - $V_{data}$ = 30b (предположим что записей 10 тогда выходит 300b)

Суммарный объем памяти, занимаемый одной строкой в таблице statusHistory:

$\sum_{x}^y$ = 4b + 4b + 30b * 10 = 308b

## Избыточность модели (отношение между фактическим объемом модели и “чистым” объемом данных).

Пусть:
- W - число пользователей;
- Z1 - число связей с таблицей isDriver;
- Z2 - число связей с таблицей isFuture;
- Z3 - число связей с таблицей isSure;
- X - число поездок;
- $V^U_i$ - объем данных, занимаемый полем i таблицы USER ;
- $V^R_i$ - объем данных, занимаемый полем i таблицы RIDE ;
- $V^isD_i$ - объем данных, занимаемый полем i таблицы isDriver ;
- $V^isF_i$ - объем данных, занимаемый полем i таблицы isFuture ;
- $V^isS_i$ - объем данных, занимаемый полем i таблицы isSure ;
- $V^sH_i$ - объем данных, занимаемый полем i таблицы statusHistory ;

**"Чистый" объем данных.**

Чистый объем данных
$V_{чист} = 92b * W + 214b * X + 300b * X

При W = 300, X = 200, количество данных, занимаемой "чистыми" данными = 300 * 92  + 514 * 200 = 130400

**Фактический объем данных для модели SQL**:

$V_{факт} = (92b + 16b) * W + (214b + 20b) * X + (300b + 8b) * X + Z1 * 12b + Z2 * 12b + Z3 * 12b$

При W = 300, X = 200, Z1 = Z2 = Z3 = 400, количество данных, занимаемой SQL моделью = 108 * 300 + 200 * 542 + 400 * 36 = 155200

$\frac{V_{факт}}{V_{чист}} = 1.19$

## Запросы к модели, с помощью которых реализуются сценарии использования

1. Создание таблицы USER

```
CREATE TABLE USER (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (isDriverId) REFERENCES isDriver (isDriverId),
    FOREIGN KEY (isFutureId) REFERENCES isFuture (isFutureId),
    FOREIGN KEY (isSureId) REFERENCES isSure (isSureId),
    username VARCHAR(30) NOT NULL UNIQUE,
    id VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(30) NOT NULL,
    isAuthorized BOOLEAN,
    isAdmin BOOLEAN
);

```

2. Создание таблицы RIDE

```
CREATE TABLE RIDE (
    rideId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (isDriverId) REFERENCES isDriver (isDriverId),
    FOREIGN KEY (isFutureId) REFERENCES isFuture (isFutureId),
    FOREIGN KEY (isSureId) REFERENCES isSure (isSureId),
    FOREIGN KEY (statusHistoryId) REFERENCES isSure (isSureId),
    date VARCHAR(30) NOT NULL,
    from VARCHAR(60) NOT NULL,
    to VARCHAR(60) NOT NULL,
    title VARCHAR(30) NOT NULL,
    price SMALLINT,
    maxPassangers SMALLINT,
    id VARCHAR(30) NOT NULL
); 
```

3. Создание таблицы isDriver

```
CREATE TABLE isDriver (
    isDriverId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (userId) REFERENCES USER (userId),
    FOREIGN KEY (rideId) REFERENCES RIDE (rideId)
); 
```


4.  Создание таблицы isFuture

```
CREATE TABLE isFuture (
    isFutureId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (userId) REFERENCES USER (userId),
    FOREIGN KEY (rideId) REFERENCES RIDE (rideId)
); 
```
5.  Создание таблицы isSure

```
CREATE TABLE isSure (
    isSureId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (userId) REFERENCES USER (userId),
    FOREIGN KEY (rideId) REFERENCES RIDE (rideId)
); 
```
6.  Создание таблицы statusHistory

```
CREATE TABLE statusHistory (
    statusHistoryId INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (rideId) REFERENCES RIDE (rideId),
    data VARCHAR(30)
); 
```
7.  Добавление пользователя

```
INSERT INTO USER (
    username, 
    id,
    password,
    isAuthorized,
    isAdmin,
) VALUES (
  'ivanovich',
  '4376473646',
  'qwerty123',
  FALSE,
  FALSE
);
```
7.  Редактирование информации пользователя

```
UPDATE USER
SET username = 'petrov',
    isAdmin = TRUE
WHERE id = '4376473646'
```
8.  Получение пользователя по id

```
SELECT * FROM WORKER where id = '4376473646'
```
9.  Получение всех пользователей

```
SELECT * FROM USER
```
10.  Получение всех админов

```
SELECT * FROM USER
WHERE USER.isAdmin == TRUE
```
11.  Удаление пользователя по id

```
DELETE FROM USER where id = '4376473646'
```
12.  Авторизация

```
UPDATE USER
SET USER.isAuthorized = TRUE
WHERE USER.username == "john" AND USER.password == "qwerty"
```
13.  Выход из системы

```
UPDATE USER
SET USER.isAuthorized = FALSE
WHERE USER.username == "john"
```
14.  Добавление поездки

```
INSERT INTO RIDE (
    date, 
    from,
    to,
    title,
    price,
    maxPassengers,
    id
) VALUES (
  '24-12-2022',
  'Moscow',
  'Saint-Petersburg',
  'Ride from M to S',
  500,
  4,
  '231423423434'
);
```
15.  Получение всех будущих поездок

```
SELECT RIDE.id FROM USER 
INNER JOIN isFuture ON USER.isFutureId == isFuture.isFutureId
INNER JOIN RIDE ON isFuture.rideId == RIDE.rideId 
```
16.  Получение всех поездок где пользователь водитель 23-04-2023 числа

```
SELECT RIDE.id FROM USER 
INNER JOIN isDriver ON USER.isDriverId == isDriver.isDriverId
INNER JOIN RIDE ON isDriver.rideId == RIDE.rideId 
WHERE RIDE.date == '23-04-2023'
```
17.  Получение количества всех будущих поездок

```
SELECT COUNT(RIDE.id) FROM USER 
INNER JOIN isFuture ON USER.isFutureId == isFuture.isFutureId
INNER JOIN RIDE ON isFuture.rideId == RIDE.rideId 
```
18.  Добавление пользователя в водители поездки

```
INSERT INTO isDriver (
    isDriverId,
    userId,
    rideId
) VALUES (
  '35465',
  '47355',
  '6776776'
)
```
19.  Получение всех поездок (с пагинацией)

```
SELECT * FROM RIDE ORDER by r.id SKIP (page_no - 1) * MAX_PAGE_SIZE LIMIT MAX_PAGE_SIZE
```
20.  Удаление поездок с определенной датой

```
DELETE FROM WORKER WHERE date = '29-12-2022'
```

21.  Удаление пользователя из водителей поездки

```
DELETE FROM isDriver WHERE userId == '34243424234'

```


# Сравнение SQL и NoSQL
- Отношение фактических данных к "чистым" дали следующие результаты: для SQL - 1.19, для NoSQL - 1.01. Таким образом, получили, что NoSQL модель более экономична по памяти, нежели SQL.
- Neo4j имеет преимущество в виде графовой структуры. Данная структура позволяет избежать создание дополнительных таблиц для связей путем создания связей между узлами данных.
- Количество запросов, необходимых для выполнения сценариев использования в SQL модели больше.

Вывод: для данной задачи определенно лучше использовать NoSQL модель. Она занимает меньше места, и с ней проще работать.
