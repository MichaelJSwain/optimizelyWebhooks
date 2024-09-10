{
    "url": "/projects/20129521369/flags/qa_webhook_test/environments/production/ruleset",
    "update_url": "/projects/20129521369/flags/qa_webhook_test/environments/production/ruleset",
    "enable_url": "/projects/20129521369/flags/qa_webhook_test/environments/production/ruleset/enabled",
    "rules": {
      "qa_webhook_test": {
        "key": "qa_webhook_test",
        "name": "qa_webhook_test",
        "description": "",
        "variations": {
          "off": {
            "key": "off",
            "name": "Off",
            "percentage_included": 5000,
            "variation_id": 806893
          },
          "on": {
            "key": "on",
            "name": "On",
            "percentage_included": 5000,
            "variation_id": 806894
          }
        },
        "type": "a/b",
        "distribution_mode": "manual",
        "id": 1031970,
        "urn": "rules.flags.optimizely.com::1031970",
        "archived": false,
        "enabled": true,
        "created_time": "2024-09-10T08:52:23.004422Z",
        "updated_time": "2024-09-10T12:52:40.713420Z",
        "audience_conditions": [
          "or",
          {
            "audience_id": 20480581221
          }
        ],
        "audience_ids": [
          20480581221
        ],
        "percentage_included": 2900,
        "metrics": [
          {
            "scope": "visitor",
            "aggregator": "sum",
            "winning_direction": "increasing",
            "field": "revenue",
            "display_title": "Overall Revenue"
          }
        ],
        "allow_list": {},
        "group_rule": {
          "group_id": 0,
          "traffic_allocation": 0
        },
        "group_remaining_traffic_allocation": 100,
        "layer_id": 9300001103780,
        "layer_experiment_id": 9300001627320,
        "status": "running",
        "comment": "",
        "deployed_variation_key": "",
        "deployed_td_rule_key": ""
      }
    },
    "rule_priorities": [
      "qa_webhook_test"
    ],
    "id": 1024097,
    "urn": "rulesets.flags.optimizely.com::1024097",
    "archived": false,
    "enabled": false,
    "updated_time": "2024-09-10T12:52:40.745792Z",
    "flag_key": "qa_webhook_test",
    "environment_key": "production",
    "environment_name": "Production",
    "default_variation_key": "off",
    "default_variation_name": "Off",
    "revision": 23,
    "status": "paused",
    "role": "publish"
  }