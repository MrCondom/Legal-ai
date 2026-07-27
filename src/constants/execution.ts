const executions =
{
  "individual": {
    "content": [
      {
        "type": "heading",
        "value": ["SIGNED, SEALED AND DELIVERED\n\n",
          "By the Assignor\n\n",
          "_________________\n",
          "{{assignorName}} "]
      },
      {
        "type": "address",
        "value": [
          "In the presence of:\n\n",
          "NAME: __________________\n",
          "ADDRESS:___________________\n",
          "OCCUPATION:__________________\n",
          "SIGNATURE:__________________\n\n"]
      },
      {
        "type": "heading",
        "value": ["SIGNED, SEALED AND DELIVERED\n\n",
          "By the Assignee\n\n",
          "________________\n",
          "{{assigneeName}} "]
      },
      {
        "type": "address",
        "value": [
          "In the presence of:\n\n",
          "NAME: __________________\n",
          "ADDRESS:___________________\n",
          "OCCUPATION:__________________\n",
          "SIGNATURE:__________________\n\n"]
      }
    ]
  },

  "company": {
    "content": [
      {
        "type": "text",
        "value": ["THE COMMON SEAL OF {{companyName}} PURSUANT TO A RESOLUTION HELD ON {{resolutionDate}}, WAS AFFIXED TO THIS DEED AND DELIVERED\n\n",
          "In the presence of;"]
      },
      {
        "type": "row",
        "left": "_____",
        "right": "_____"
      },
      {
        "type": "row",
        "left": "Director",
        "right": "Director"
      }
    ]
  },

  "illiterate": {
    "content": [
      {
        "type": "text",
        "value": ["SIGNED, SEALED AND DELIVERED\n\n",
          "By the Assignor\n",
          "_________________\n",
          "{{illiterate}} \n\n\n",
          "The content of this document having been first read and interpreted to him in {{interpretedLanguage}} from English language by me, {{interpreterName}} (sworn interpreter) of {{interpreterAddress}}, and he appeared perfectly to understand it before affixing his thumbprint."]
      },
      {
        "type": "heading",
        "value": [
          "BEFORE ME:\n",
          "_________________\n\n",
          "{{magistrateName}}."]
      }
    ]
  },

  "attorney": {
    "content": [
      {
        "type": "text",
        "value": ["SIGNED, SEALED AND DELIVERED\n\n",
          "By the Assignor\n",
          "_________________\n\n",
          "{{assignorName}} through his true and lawful attorney {{attorneyName}}, by virtue of a power of attorney dated this {{powerOfAttorneyExecutionDate}}, registered {{date&placeOfRegistrationOfPowerOfAttorney}}."]
      },
      {
        "type": "address",
        "value": [
          "In the presence of:\n\n",
          "NAME: __________________\n",
          "ADDRESS:___________________\n",
          "OCCUPATION:__________________\n",
          "SIGNATURE:__________________\n\n"]
      }
    ]
  },

  "familyProperty": {
    "content": [
      {
        "type": "text",
        "value": ["SIGNED, SEALED AND DELIVERED\n\n",
          "By the within named Assignors\n",
          "_________________\n",
          "{{familyHead}} \n\n",
          "(Family Head)"]
      },
      {
        "type": "text",
        "value": ["_________________\n",
          "Bruce jabman\n\n",
          "(Family Member)"
        ]
      },
      {
        "type": "text",
        "value": ["_________________\n",
          "{{familyMember}}\n\n",
          "(Family Member)"
        ]
      },
      {
        "type": "heading",
        "value": "for themselves and on behalf of the {{name&addressOfFamily}}."
      },
      {
        "type": "address",
        "value": [
          "In the presence of:\n\n",
          "NAME: __________________\n",
          "ADDRESS:___________________\n",
          "OCCUPATION:__________________\n",
          "SIGNATURE:__________________\n\n"]
      }
    ]
  },
};

export default executions;
