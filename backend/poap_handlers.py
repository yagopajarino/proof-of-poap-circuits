import requests, json, socket, sys
import os

POAP_API_KEY = os.environ.get("POAP_API_KEY")
API_URL = "https://api.poap.tech"


class PoapHandlers:
    def __init__(self):
        self.headers = {
            "x-API-key": POAP_API_KEY,
            "accept": "application/json",
        }

    def scan_address_path(self, address):
        return f"{API_URL}/actions/scan/{address}"

    def scan_path(self, address, event_id):
        return f"{API_URL}/actions/scan/{address}/{str(event_id)}"

    def event_path(self, event_id):
        return f"{API_URL}/event/{str(event_id)}/poaps"

    def owners_of(self, event_id):
        path = self.event_path(event_id)
        r = requests.get(path, headers=self.headers)
        content = json.loads(r.content.decode("utf-8"))
        tokens = [token["owner"]["id"] for token in content["tokens"]]
        return tokens

    def events_of(self, address):
        path = self.scan_address_path(address)
        r = requests.get(path, headers=self.headers)
        content = json.loads(r.content.decode("utf-8"))
        events = [event["event"]["id"] for event in content]
        return events

    def event_details_path(self, event_id):
        return f"{API_URL}/events/id/{str(event_id)}"

    def get_event_data(self, event_id):
        path = self.event_details_path(event_id)
        r = requests.get(path, headers=self.headers)
        content = json.loads(r.content.decode("utf-8"))
        return content
