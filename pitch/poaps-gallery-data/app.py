import requests
import datetime

palabras_clave = ["devcon", "bangkok", "ethglobal", "ethereum"]
ids = []
minted = 0
for palabra_clave in palabras_clave:

    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,es-US;q=0.8,es-ES;q=0.7,es;q=0.6,pt;q=0.5,gl;q=0.4",
        "content-type": "application/json; charset=utf-8",
        "origin": "https://poap.gallery",
        "priority": "u=1, i",
        "referer": "https://poap.gallery/",
        "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    }

    json_data = {
        "query": 'query SearchPaginatedDrops(\n  $limit: Int!,\n  $offset: Int!,\n  $orderBy: [drops_order_by!],\n  $where: drops_bool_exp,\n  $search: String = ""\n  ) {\n  search_drops(limit: $limit, offset: $offset, order_by: $orderBy, where: $where, args: {search: $search}) {\n    \nid\nname\ndescription\ncity\ncountry\nchannel\nplatform\nlocation_type\ndrop_url\nimage_url\nstart_date\ntimezone\nend_date\nvirtual\nexpiry_date\nprivate\nstats_by_chain_aggregate {\n  aggregate {\n    sum {\n      transfer_count\n      poap_count\n    }\n  }\n}\n\n  }\n}',
        "variables": {
            "limit": 1000,
            "offset": 0,
            "search": palabra_clave,
            "where": {
                "private": {
                    "_eq": "false",
                },
                "stats_by_chain": {
                    "poap_count": {
                        "_gte": 1,
                    },
                },
            },
            "orderBy": [
                {
                    "id": "desc",
                },
            ],
        },
    }

    response = requests.post(
        "https://public.compass.poap.tech/v1/graphql", headers=headers, json=json_data
    )

    poaps = response.json()["data"]["search_drops"]

    poaps_nov_2024 = [
        poap
        for poap in poaps
        if datetime.datetime.fromisoformat(poap["start_date"]).replace(tzinfo=None)
        > datetime.datetime(2024, 11, 1)
    ]
    print(palabra_clave, len(poaps_nov_2024))
    for poap in poaps_nov_2024:
        if poap["id"] not in ids:
            ids.append(poap["id"])
            minted += poap["stats_by_chain_aggregate"]["aggregate"]["sum"]["poap_count"]

print("POAPS", len(ids))
print("Total", minted)
