import { StackType } from '../../type';
import { WidgetType } from '../../constants';
import { Page, Report } from '../yaml_parser/YamlParser';

export const SAMPLE_REPORT = {
  "header": {
    "title": {
      "type": "text",
      "value": "Header",
      "color": "red",
      "fontSize": 32,
      "border": {
        "style": "dashed",
        "size": 2,
        "color": "grey"
      }
    },
    "subtitle": {
      "type": "text",
      "width": "100%",
      "value": "Report builder Sample code"
    },
    "logo": {
      "type": "image",
      "src": "/public/Image/CE_Logo_Icon.png",
      "width": "100%",
      "height": 120
    }
  },
  "footer": {
    "pageNo": {
      "visible": true,
      "align": "end"
    },
    "title": {
      "type": "text",
      "value": "Report Builder",
      "width": "100%",
      "color": "pink",
      "fontSize": 24,
      "border": {
        "style": "dashed",
        "size": 1,
        "color": "pink"
      }
    },
    "subtitle": {
      "type": "text",
      "width": "100%",
      "value": "Copyright by @Cermate Software Inc."
    },
    "logo": {
      "type": "image",
      "src": "/public/Image/CE_Logo_Web.png",
      "width": 60,
      "height": 60
    }
  },
  "orientation": "horizontal",
  "pages": [
    {
      "content": [
        {
          "type": "vertical",
          "gap": 10,
          "style": {
            "backgroundColor": "grey"
          },
          "content": [
            {
              "type": "horizontal",
              "gap": 20,
              "style": {
                "align": "start"
              },
              "content": [
                {
                  "type": "barchart",
                  "width": "33%",
                  "height": 200,
                  "configs": {
                    "color": "red"
                  }
                },
                {
                  "type": "gaugechart",
                  "width": "33%",
                  "height": 400,
                  "configs": {
                    "bgColor": "#18ffd8"
                  }
                },
                {
                  "type": "linechart",
                  "width": "33%",
                  "height": 200
                }
              ]
            },
            {
              "type": "protable",
              "width": 580,
              "height": 200
            },
            {
              "type": "vertical",
              "style": {
                "align": "center"
              },
              "content": [
                {
                  "type": "barchart",
                  "width": 400,
                  "height": 200
                },
                {
                  "type": "gaugechart",
                  "width": 300,
                  "height": 200
                },
                {
                  "type": "linechart",
                  "width": 580,
                  "height": 200
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "content": [
        {
          "type": "horizontal",
          "width": 600,
          "height": 1800,
          "content": [
            {
              "type": "horizontal",
              "width": 600,
              "height": 200,
              "content": [
                {
                  "type": "barchart",
                  "width": "33%",
                  "height": 200,
                  "configs": {
                    "color": "red"
                  }
                },
                {
                  "type": "gaugechart",
                  "width": "33%",
                  "height": 400,
                  "configs": {
                    "bgColor": "#18ffd8"
                  }
                },
                {
                  "type": "linechart",
                  "width": "33%",
                  "height": 200
                }
              ]
            },
            {
              "type": "protable",
              "width": 600,
              "height": 200
            },
            {
              "type": "vertical",
              "width": 600,
              "height": 200,
              "content": [
                {
                  "type": "barchart",
                  "width": 400,
                  "height": 200
                },
                {
                  "type": "gaugechart",
                  "width": 300,
                  "height": 200
                },
                {
                  "type": "linechart",
                  "width": 580,
                  "height": 200
                }
              ]
            }
          ]
        }
      ]
    }
  ]
} as Report