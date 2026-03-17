export const QUESTION_BANK_SOURCE = {
  "meta": {
    "name": "FFQ Question Bank",
    "version": "1.0.0"
  },
  "scoring": {
    "dimensionWeightsDefault": {
      "lifestyle": 0.3,
      "diet": 0.35,
      "health": 0.25,
      "goal": 0.1
    },
    "multiSelectScoringRule": {
      "mode": "min"
    }
  },
  "questions": [
    {
      "id": "B01",
      "dimension": "basic",
      "type": "single_choice",
      "title": "你的性别是？",
      "options": [
        {
          "label": "男",
          "value": "male",
          "score": null,
          "tags": [
            "male"
          ]
        },
        {
          "label": "女",
          "value": "female",
          "score": null,
          "tags": [
            "female"
          ]
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "B02",
      "dimension": "basic",
      "type": "single_choice",
      "title": "你的年龄是？",
      "options": [
        {
          "label": "3岁以下",
          "value": "age_0_3",
          "score": null,
          "tags": [
            "child"
          ]
        },
        {
          "label": "4-12岁",
          "value": "age_4_12",
          "score": null,
          "tags": [
            "child"
          ]
        },
        {
          "label": "13-17岁",
          "value": "age_13_17",
          "score": null,
          "tags": [
            "teen"
          ]
        },
        {
          "label": "18-35岁",
          "value": "age_18_35",
          "score": null,
          "tags": [
            "adult"
          ]
        },
        {
          "label": "36-59岁",
          "value": "age_36_59",
          "score": null,
          "tags": [
            "adult"
          ]
        },
        {
          "label": "60-70岁",
          "value": "age_60_70",
          "score": null,
          "tags": [
            "senior"
          ]
        },
        {
          "label": "70岁以上",
          "value": "age_70_plus",
          "score": null,
          "tags": [
            "senior"
          ]
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "B03",
      "dimension": "basic",
      "type": "group_input",
      "title": "你的身高（cm）和体重（kg）是？",
      "fields": [
        {
          "key": "heightCm",
          "label": "身高(cm)",
          "inputType": "number",
          "min": 100,
          "max": 250,
          "required": true
        },
        {
          "key": "weightKg",
          "label": "体重(kg)",
          "inputType": "number",
          "min": 20,
          "max": 200,
          "required": true
        }
      ],
      "required": true,
      "showIf": []
    },
    {
      "id": "B04",
      "dimension": "basic",
      "type": "single_choice",
      "title": "你所在的地域是？",
      "options": [
        {
          "label": "北方（京津冀/东北/西北）",
          "value": "north",
          "score": null
        },
        {
          "label": "南方（江浙沪/华南/西南）",
          "value": "south",
          "score": null
        },
        {
          "label": "中部（豫鄂湘皖）",
          "value": "central",
          "score": null
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "B05",
      "dimension": "basic",
      "type": "single_choice",
      "title": "你目前的生理阶段是？",
      "options": [
        {
          "label": "普通阶段",
          "value": "female_general",
          "score": null,
          "tags": [
            "female_general"
          ]
        },
        {
          "label": "备孕中",
          "value": "female_preconception",
          "score": null,
          "tags": [
            "female_preconception"
          ]
        },
        {
          "label": "孕期",
          "value": "female_pregnant",
          "score": null,
          "tags": [
            "female_pregnant"
          ]
        },
        {
          "label": "哺乳期",
          "value": "female_lactation",
          "score": null,
          "tags": [
            "female_lactation"
          ]
        },
        {
          "label": "更年期",
          "value": "female_menopause",
          "score": null,
          "tags": [
            "female_menopause"
          ]
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "female"
          ]
        }
      ]
    },
    {
      "id": "L01",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你平均每天的睡眠时长是？",
      "options": [
        {
          "label": "小于6小时",
          "value": "lt6",
          "score": 1
        },
        {
          "label": "6-7小时",
          "value": "6_7",
          "score": 3
        },
        {
          "label": "7-8小时",
          "value": "7_8",
          "score": 5
        },
        {
          "label": "大于8小时",
          "value": "gt8",
          "score": 4
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "L02",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你入睡及夜间睡眠情况是？",
      "options": [
        {
          "label": "难入睡+频繁夜醒",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "难入睡/频繁夜醒",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "入睡顺利，偶夜醒",
          "value": "ok_some",
          "score": 4
        },
        {
          "label": "入睡顺利，一觉到天亮",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "L03",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你吸烟/饮酒习惯是？",
      "options": [
        {
          "label": "经常吸烟+饮酒",
          "value": "often_both",
          "score": 1
        },
        {
          "label": "吸烟/饮酒其一",
          "value": "often_one",
          "score": 2
        },
        {
          "label": "偶尔吸烟/饮酒",
          "value": "sometimes",
          "score": 3
        },
        {
          "label": "从不",
          "value": "never",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "noneTags": [
            "child",
            "teen"
          ]
        }
      ]
    },
    {
      "id": "L04",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你每周运动频率及强度是？",
      "options": [
        {
          "label": "几乎不运动",
          "value": "none",
          "score": 1
        },
        {
          "label": "1-2次，轻度（散步）",
          "value": "light_1_2",
          "score": 2
        },
        {
          "label": "3-4次，中度（慢跑/瑜伽）",
          "value": "mid_3_4",
          "score": 4
        },
        {
          "label": "5次以上，中高强度（健身/球类）",
          "value": "high_5plus",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "L05",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你每天久坐（含电子设备）时长是？",
      "options": [
        {
          "label": "大于8小时",
          "value": "gt8",
          "score": 1
        },
        {
          "label": "6-8小时",
          "value": "6_8",
          "score": 2
        },
        {
          "label": "4-6小时",
          "value": "4_6",
          "score": 3
        },
        {
          "label": "小于4小时",
          "value": "lt4",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "L06",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你近期记忆力及骨骼状况是？",
      "options": [
        {
          "label": "记忆力明显衰退+频繁骨痛",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "记忆力减退/骨痛其一",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "记忆力正常，偶骨痛",
          "value": "ok_some",
          "score": 4
        },
        {
          "label": "记忆力正常，无骨痛",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "senior"
          ]
        }
      ]
    },
    {
      "id": "L07",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你近期是否有跌倒风险？",
      "options": [
        {
          "label": "近3个月跌倒过",
          "value": "fell",
          "score": 1
        },
        {
          "label": "走路不稳，易绊倒",
          "value": "unstable",
          "score": 2
        },
        {
          "label": "走路平稳，偶尔大意",
          "value": "ok",
          "score": 4
        },
        {
          "label": "走路稳健，无风险",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "senior"
          ]
        }
      ]
    },
    {
      "id": "L08",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你的经期及经前不适情况是？",
      "options": [
        {
          "label": "经期紊乱+严重经前不适",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "经期紊乱/严重经前不适其一",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "经期规律，轻微经前不适",
          "value": "ok_some",
          "score": 4
        },
        {
          "label": "经期规律，无不适",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "female"
          ]
        },
        {
          "anyTags": [
            "female_general",
            "female_menopause"
          ]
        }
      ]
    },
    {
      "id": "L09",
      "dimension": "lifestyle",
      "type": "single_choice",
      "title": "你每天户外活动及零食摄入情况是？",
      "options": [
        {
          "label": "小于1小时户外活动+频繁吃零食",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "小于1小时户外活动/频繁吃零食其一",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "1-2小时户外活动，偶尔吃零食",
          "value": "ok",
          "score": 4
        },
        {
          "label": "大于2小时户外活动，少吃/不吃零食",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "anyTags": [
            "child",
            "teen"
          ]
        }
      ]
    },
    {
      "id": "E01",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你每天主食（米饭/面条/杂粮）摄入量是？",
      "options": [
        {
          "label": "小于1碗",
          "value": "lt1",
          "score": 1
        },
        {
          "label": "1-2碗",
          "value": "1_2",
          "score": 3
        },
        {
          "label": "2-3碗",
          "value": "2_3",
          "score": 4
        },
        {
          "label": "大于3碗",
          "value": "gt3",
          "score": 2
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "E02",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你每天蔬菜摄入量及种类是？",
      "options": [
        {
          "label": "几乎不吃",
          "value": "none",
          "score": 1
        },
        {
          "label": "1种，少量",
          "value": "low_1",
          "score": 2
        },
        {
          "label": "2-3种，适量",
          "value": "mid_2_3",
          "score": 4
        },
        {
          "label": "3种以上，充足",
          "value": "high_3plus",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "E03",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你每天水果摄入量及种类是？",
      "options": [
        {
          "label": "几乎不吃",
          "value": "none",
          "score": 1
        },
        {
          "label": "1种，少量",
          "value": "low_1",
          "score": 2
        },
        {
          "label": "2种，适量",
          "value": "mid_2",
          "score": 4
        },
        {
          "label": "2种以上，充足",
          "value": "high_2plus",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "E04",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你每周肉蛋（瘦肉/鸡蛋/鱼虾）摄入量是？",
      "options": [
        {
          "label": "小于2次",
          "value": "lt2",
          "score": 1
        },
        {
          "label": "2-4次",
          "value": "2_4",
          "score": 3
        },
        {
          "label": "5-6次",
          "value": "5_6",
          "score": 4
        },
        {
          "label": "每天1次及以上",
          "value": "daily",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "E05",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你每天奶制品（牛奶/酸奶/奶酪）摄入量是？",
      "options": [
        {
          "label": "几乎不喝",
          "value": "none",
          "score": 1
        },
        {
          "label": "小于200ml",
          "value": "lt200",
          "score": 2
        },
        {
          "label": "200-300ml",
          "value": "200_300",
          "score": 5
        },
        {
          "label": "大于300ml",
          "value": "gt300",
          "score": 4
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "E06",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你家孩子辅食/正餐挑食、偏食情况是？",
      "options": [
        {
          "label": "严重挑食，仅吃少数几种",
          "value": "severe",
          "score": 1
        },
        {
          "label": "轻微挑食，部分食物不吃",
          "value": "mild",
          "score": 2
        },
        {
          "label": "基本不挑食，偶尔抗拒",
          "value": "ok",
          "score": 4
        },
        {
          "label": "不挑食，饮食均衡",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "child"
          ]
        }
      ]
    },
    {
      "id": "E07",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你的咀嚼能力及每日饮水量是？",
      "options": [
        {
          "label": "咀嚼困难+小于800ml饮水量",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "咀嚼一般/小于800ml饮水量其一",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "咀嚼正常，800-1500ml饮水量",
          "value": "ok",
          "score": 4
        },
        {
          "label": "咀嚼正常，大于1500ml饮水量",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "senior"
          ]
        }
      ]
    },
    {
      "id": "E08",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你的饮食口味偏好是？",
      "description": "（高血压/糖尿病等人群可做联动风险提示）",
      "options": [
        {
          "label": "重油重盐重糖",
          "value": "heavy_all",
          "score": 1
        },
        {
          "label": "偏油/偏咸/偏甜其一",
          "value": "heavy_one",
          "score": 2
        },
        {
          "label": "清淡，偶尔偏重",
          "value": "light_sometimes",
          "score": 4
        },
        {
          "label": "长期清淡",
          "value": "light_always",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "E09",
      "dimension": "diet",
      "type": "single_choice",
      "title": "你是否规律补充叶酸/铁剂？",
      "options": [
        {
          "label": "从不补充",
          "value": "never",
          "score": 1
        },
        {
          "label": "偶尔补充",
          "value": "rare",
          "score": 2
        },
        {
          "label": "间断规律补充",
          "value": "sometimes",
          "score": 4
        },
        {
          "label": "每天规律补充",
          "value": "daily",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "female"
          ]
        },
        {
          "anyTags": [
            "female_preconception",
            "female_pregnant",
            "female_lactation"
          ]
        }
      ]
    },
    {
      "id": "H01",
      "dimension": "health",
      "type": "multi_choice",
      "title": "你是否有以下基础疾病？（可多选）",
      "description": "多选计分：取最低分。",
      "options": [
        {
          "label": "无基础疾病",
          "value": "none",
          "score": 5
        },
        {
          "label": "高血压",
          "value": "hypertension",
          "score": 2
        },
        {
          "label": "糖尿病",
          "value": "diabetes",
          "score": 2
        },
        {
          "label": "高血脂",
          "value": "hyperlipidemia",
          "score": 2
        },
        {
          "label": "其他慢性病",
          "value": "other_chronic",
          "score": 3
        }
      ],
      "required": true,
      "autoNext": false,
      "showIf": []
    },
    {
      "id": "H02",
      "dimension": "health",
      "type": "single_choice",
      "title": "你近期是否有疲劳、头晕、眼干等不适症状？",
      "options": [
        {
          "label": "频繁出现",
          "value": "often",
          "score": 1
        },
        {
          "label": "偶尔出现",
          "value": "sometimes",
          "score": 3
        },
        {
          "label": "极少出现",
          "value": "rare",
          "score": 4
        },
        {
          "label": "从未出现",
          "value": "never",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "H03",
      "dimension": "health",
      "type": "single_choice",
      "title": "孩子近期生长发育及免疫力情况是？",
      "options": [
        {
          "label": "生长缓慢+每月感冒大于等于2次",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "生长缓慢/每月感冒大于等于2次其一",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "生长正常，每月感冒1次",
          "value": "ok",
          "score": 4
        },
        {
          "label": "生长正常，极少感冒",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "child"
          ]
        }
      ]
    },
    {
      "id": "H04",
      "dimension": "health",
      "type": "single_choice",
      "title": "你近期视力/听力及慢性病控制情况是？",
      "options": [
        {
          "label": "视力/听力明显退化+慢性病控制差",
          "value": "bad_both",
          "score": 1
        },
        {
          "label": "其一退化/控制一般",
          "value": "bad_one",
          "score": 2
        },
        {
          "label": "轻微退化，控制良好",
          "value": "ok",
          "score": 4
        },
        {
          "label": "无退化，控制稳定",
          "value": "good",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": [
        {
          "allTags": [
            "senior"
          ]
        }
      ]
    },
    {
      "id": "H05",
      "dimension": "health",
      "type": "single_choice",
      "title": "你是否正在服用药物或营养补充剂？",
      "description": "用于后续药物相互作用提示",
      "options": [
        {
          "label": "长期服用药物",
          "value": "drug_long",
          "score": 2
        },
        {
          "label": "长期服用补剂",
          "value": "supp_long",
          "score": 3
        },
        {
          "label": "偶尔服用",
          "value": "sometimes",
          "score": 4
        },
        {
          "label": "从不服用",
          "value": "never",
          "score": 5
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "H06",
      "dimension": "health",
      "type": "single_choice",
      "title": "你过往是否有重大疾病史？",
      "options": [
        {
          "label": "有",
          "value": "yes",
          "score": 2
        },
        {
          "label": "无",
          "value": "no",
          "score": 5
        },
        {
          "label": "记不清",
          "value": "unknown",
          "score": 3
        }
      ],
      "required": true,
      "autoNext": true,
      "showIf": []
    },
    {
      "id": "G01",
      "dimension": "goal",
      "type": "multi_choice",
      "title": "你核心的健康目标是？",
      "description": "可多选；用于建议匹配优先级。",
      "options": [
        {
          "label": "改善睡眠",
          "value": "sleep",
          "score": null
        },
        {
          "label": "提升免疫力",
          "value": "immunity",
          "score": null
        },
        {
          "label": "体重管理",
          "value": "weight",
          "score": null
        },
        {
          "label": "皮肤状态优化",
          "value": "skin",
          "score": null
        },
        {
          "label": "促进生长发育",
          "value": "growth",
          "score": null,
          "showForTags": [
            "child"
          ]
        },
        {
          "label": "增强体质",
          "value": "strength",
          "score": null,
          "showForTags": [
            "child"
          ]
        },
        {
          "label": "维护骨骼健康",
          "value": "bone",
          "score": null,
          "showForTags": [
            "senior"
          ]
        },
        {
          "label": "改善记忆力",
          "value": "memory",
          "score": null,
          "showForTags": [
            "senior"
          ]
        },
        {
          "label": "备孕调理",
          "value": "preconception",
          "score": null,
          "showForTags": [
            "female"
          ]
        },
        {
          "label": "经期护理",
          "value": "menstrual",
          "score": null,
          "showForTags": [
            "female"
          ]
        }
      ],
      "required": true,
      "autoNext": false,
      "showIf": []
    }
  ]
};

export const QUESTION_BANK_EN_TRANSLATIONS = {
  "titles": {
    "B01": "What is your gender?",
    "B02": "What is your age?",
    "B03": "What are your height (cm) and weight (kg)?",
    "B04": "Which region do you live in?",
    "B05": "What is your current physiological stage?",
    "L01": "How many hours do you sleep per day on average?",
    "L02": "How is your sleep onset and nighttime sleep?",
    "L03": "What are your smoking and drinking habits?",
    "L04": "How often and how intensely do you exercise each week?",
    "L05": "How long are you sedentary each day, including screen time?",
    "L06": "How are your recent memory and bone conditions?",
    "L07": "Have you recently had any fall risk?",
    "L08": "How are your menstrual cycle and premenstrual discomfort?",
    "L09": "How much outdoor activity and snacking do you have each day?",
    "E01": "How much staple food (rice/noodles/whole grains) do you eat each day?",
    "E02": "How much and how many kinds of vegetables do you eat each day?",
    "E03": "How much and how many kinds of fruit do you eat each day?",
    "E04": "How much meat and eggs (lean meat/eggs/fish/shrimp) do you eat each week?",
    "E05": "How much dairy (milk/yogurt/cheese) do you consume each day?",
    "E06": "How picky is your child with complementary foods or regular meals?",
    "E07": "How are your chewing ability and daily water intake?",
    "E08": "What is your taste preference?",
    "E09": "Do you regularly supplement folic acid or iron?",
    "H01": "Do you have any of the following underlying conditions? (Multiple choice)",
    "H02": "Have you recently had fatigue, dizziness, dry eyes, or similar discomfort?",
    "H03": "How are your child's recent growth, development, and immunity?",
    "H04": "How are your recent vision/hearing and chronic disease control?",
    "H05": "Are you currently taking medication or nutritional supplements?",
    "H06": "Do you have a history of major illness?",
    "G01": "What are your core health goals?"
  },
  "descriptions": {
    "E08": "(Can be linked to risk prompts for users with hypertension, diabetes, and related conditions.)",
    "H01": "Multi-select scoring: the lowest score is used.",
    "H05": "Used for later drug interaction reminders.",
    "G01": "Multiple selections allowed; used for recommendation priority."
  },
  "fields": {
    "B03": {
      "heightCm": "Height (cm)",
      "weightKg": "Weight (kg)"
    }
  },
  "options": {
    "B01": {
      "male": "Male",
      "female": "Female"
    },
    "B02": {
      "age_0_3": "Under 3",
      "age_4_12": "4-12",
      "age_13_17": "13-17",
      "age_18_35": "18-35",
      "age_36_59": "36-59",
      "age_60_70": "60-70",
      "age_70_plus": "Over 70"
    },
    "B04": {
      "north": "Northern China",
      "south": "Southern China",
      "central": "Central China"
    },
    "B05": {
      "female_general": "General stage",
      "female_preconception": "Trying to conceive",
      "female_pregnant": "Pregnant",
      "female_lactation": "Breastfeeding",
      "female_menopause": "Menopause"
    },
    "L01": {
      "lt6": "Less than 6 hours",
      "6_7": "6-7 hours",
      "7_8": "7-8 hours",
      "gt8": "More than 8 hours"
    },
    "L02": {
      "bad_both": "Difficulty falling asleep + frequent waking",
      "bad_one": "Either difficulty falling asleep or frequent waking",
      "ok_some": "Easy to fall asleep, occasional waking",
      "good": "Fall asleep easily and sleep through the night"
    },
    "L03": {
      "often_both": "Smoke and drink frequently",
      "often_one": "Regularly do one of the two",
      "sometimes": "Occasionally smoke or drink",
      "never": "Never"
    },
    "L04": {
      "none": "Almost never exercise",
      "light_1_2": "1-2 times, light intensity (walking)",
      "mid_3_4": "3-4 times, moderate intensity (jogging/yoga)",
      "high_5plus": "5+ times, moderate to high intensity (gym/ball sports)"
    },
    "L05": {
      "gt8": "More than 8 hours",
      "6_8": "6-8 hours",
      "4_6": "4-6 hours",
      "lt4": "Less than 4 hours"
    },
    "L06": {
      "bad_both": "Noticeable memory decline + frequent bone pain",
      "bad_one": "Either memory decline or bone pain",
      "ok_some": "Memory is normal, occasional bone pain",
      "good": "Memory is normal, no bone pain"
    },
    "L07": {
      "fell": "Fell within the past 3 months",
      "unstable": "Unsteady walking, easy to trip",
      "ok": "Walk steadily, occasional carelessness",
      "good": "Walk steadily, no obvious risk"
    },
    "L08": {
      "bad_both": "Irregular cycle + severe premenstrual discomfort",
      "bad_one": "Either irregular cycle or severe premenstrual discomfort",
      "ok_some": "Regular cycle with mild PMS",
      "good": "Regular cycle with no discomfort"
    },
    "L09": {
      "bad_both": "Less than 1 hour outdoors + frequent snacks",
      "bad_one": "Either less than 1 hour outdoors or frequent snacks",
      "ok": "1-2 hours outdoors, occasional snacks",
      "good": "More than 2 hours outdoors, few or no snacks"
    },
    "E01": {
      "lt1": "Less than 1 bowl",
      "1_2": "1-2 bowls",
      "2_3": "2-3 bowls",
      "gt3": "More than 3 bowls"
    },
    "E02": {
      "none": "Hardly any",
      "low_1": "1 kind, small amount",
      "mid_2_3": "2-3 kinds, moderate amount",
      "high_3plus": "3+ kinds, plentiful"
    },
    "E03": {
      "none": "Hardly any",
      "low_1": "1 kind, small amount",
      "mid_2": "2 kinds, moderate amount",
      "high_2plus": "2+ kinds, plentiful"
    },
    "E04": {
      "lt2": "Less than 2 times",
      "2_4": "2-4 times",
      "5_6": "5-6 times",
      "daily": "Once a day or more"
    },
    "E05": {
      "none": "Hardly ever",
      "lt200": "Less than 200 ml",
      "200_300": "200-300 ml",
      "gt300": "More than 300 ml"
    },
    "E06": {
      "severe": "Very picky, only a few foods accepted",
      "mild": "Mildly picky, avoids some foods",
      "ok": "Mostly not picky, occasional resistance",
      "good": "Not picky, balanced diet"
    },
    "E07": {
      "bad_both": "Chewing difficulty + under 800 ml water",
      "bad_one": "Either chewing is average or water is under 800 ml",
      "ok": "Chewing is normal, 800-1500 ml water",
      "good": "Chewing is normal, more than 1500 ml water"
    },
    "E08": {
      "heavy_all": "High oil, salt, and sugar",
      "heavy_one": "Heavy in one of oil, salt, or sugar",
      "light_sometimes": "Generally light, occasionally heavy",
      "light_always": "Consistently light"
    },
    "E09": {
      "never": "Never",
      "rare": "Occasionally",
      "sometimes": "Intermittently but regularly",
      "daily": "Every day"
    },
    "H01": {
      "none": "No underlying condition",
      "hypertension": "Hypertension",
      "diabetes": "Diabetes",
      "hyperlipidemia": "High blood lipids",
      "other_chronic": "Other chronic disease"
    },
    "H02": {
      "often": "Frequently",
      "sometimes": "Occasionally",
      "rare": "Rarely",
      "never": "Never"
    },
    "H03": {
      "bad_both": "Slow growth + two or more colds each month",
      "bad_one": "Either slow growth or two or more colds each month",
      "ok": "Normal growth, one cold per month",
      "good": "Normal growth, rarely catches a cold"
    },
    "H04": {
      "bad_both": "Clear vision/hearing decline + poor disease control",
      "bad_one": "Either decline or only average control",
      "ok": "Mild decline, disease is well controlled",
      "good": "No decline, disease is stable"
    },
    "H05": {
      "drug_long": "Long-term medication use",
      "supp_long": "Long-term supplement use",
      "sometimes": "Occasional use",
      "never": "Never"
    },
    "H06": {
      "yes": "Yes",
      "no": "No",
      "unknown": "Can't remember"
    },
    "G01": {
      "sleep": "Better sleep",
      "immunity": "Stronger immunity",
      "weight": "Weight management",
      "skin": "Better skin condition",
      "growth": "Support growth and development",
      "strength": "Build a stronger constitution",
      "bone": "Bone health",
      "memory": "Better memory",
      "preconception": "Preconception support",
      "menstrual": "Menstrual care"
    }
  }
};
