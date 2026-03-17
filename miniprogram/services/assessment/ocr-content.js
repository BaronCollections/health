const OCR_CONTENT = {
  'zh-CN': {
    upload: {
      header: {
        title: '上传体检报告',
        subtitle: '上传 PDF 或清晰拍照，用于增强营养建议的解释链。',
      },
      hero: {
        eyebrow: '可选增强',
        title: '先上传，再进入 OCR 确认',
        body: '这一步不会替代问卷答案，只会补充关键指标，让后续建议更可解释。',
      },
      formatsLabel: '支持 PDF / JPG / PNG，建议单个文件不超过 10 MB',
      chooseSheetTitle: '选择上传方式',
      chooseImage: '上传图片',
      choosePdf: '上传 PDF',
      steps: [
        {
          id: 'upload',
          title: '上传原始报告',
          body: '建议使用最近 90 天内的体检或化验结果。',
        },
        {
          id: 'processing',
          title: '系统提取指标',
          body: '我们会先识别关键数据，再进入人工确认。',
        },
        {
          id: 'confirm',
          title: '确认后再入报告',
          body: '低置信度项目会被标记，交由你最终确认。',
        },
      ],
      idleCard: {
        title: '选择一个文件开始',
        body: '建议拍照完整、无遮挡、文字清晰，减少后续确认成本。',
        primaryCta: '选择文件',
        secondaryCta: '稍后再说',
        imageCta: '选图片',
        pdfCta: '选 PDF',
      },
      readyCard: {
        title: '文件已准备就绪',
        body: '确认文件无误后开始识别，完成后会自动进入确认页。',
        fileNameLabel: '文件名',
        fileSizeLabel: '文件大小',
        replaceCta: '重新选择',
        primaryCta: '开始识别',
      },
      processingCard: {
        title: '正在识别中',
        body: '我们会先提取关键指标，再整理成待确认结果。',
        items: ['读取版面结构', '定位关键指标', '生成待确认记录'],
      },
      footerNote: '上传内容只用于营养建议解释，不会替代医生诊断。',
      missingAssessment: '没有可用的评估会话，请先完成问卷。',
      uploadFallback: 'OCR 上传接口异常，当前已回退到本地确认流。',
      chooseFailed: '未能读取文件，请重新选择。',
    },
    confirmation: {
      header: {
        title: 'OCR 识别确认',
        subtitle: '请核对识别内容后，再用它增强你的推荐解释。',
      },
      statusCard: {
        eyebrow: '报告增强',
        title: '已提取 6 项关键指标',
        description: '低置信度字段已高亮标注，建议提交前逐项确认。',
      },
      fileMeta: {
        label: '文件来源',
        value: '体检报告',
        confidenceLabel: '整体置信度',
        confidenceValue: '需确认',
      },
      confidenceBadges: {
        high: '高置信',
        medium: '需确认',
        low: '低置信',
      },
      sections: [
        {
          id: 'baseline',
          title: '基础指标',
          fields: [
            {
              id: 'vitamin-d',
              label: '25-OH 维生素 D',
              value: '18 ng/mL',
              confidence: 'medium',
              note: '数值来自报告附注区域，建议对照原图确认。',
            },
            {
              id: 'hemoglobin',
              label: '血红蛋白',
              value: '128 g/L',
              confidence: 'high',
              note: '与表格主区域文本一致。',
            },
            {
              id: 'ferritin',
              label: '铁蛋白',
              value: '21 ng/mL',
              confidence: 'medium',
              note: '单位已自动标准化为 ng/mL。',
            },
          ],
        },
        {
          id: 'metabolic',
          title: '代谢与炎症',
          fields: [
            {
              id: 'fasting-glucose',
              label: '空腹血糖',
              value: '5.8 mmol/L',
              confidence: 'high',
              note: 'OCR 与主表数值完全一致。',
            },
            {
              id: 'triglycerides',
              label: '甘油三酯',
              value: '1.92 mmol/L',
              confidence: 'high',
              note: '已沿用原始化验单位。',
            },
            {
              id: 'hs-crp',
              label: '超敏 C 反应蛋白',
              value: '3.2 mg/L',
              confidence: 'low',
              note: '扫描边缘有遮挡，建议与纸质报告再次核对。',
            },
          ],
        },
      ],
      auditTrail: {
        title: '识别与修正记录',
        items: [
          '系统已统一异常空格和单位格式，不会改动你的原始问卷答案。',
          '低置信度字段会在后续推荐说明中标记为“待用户确认”。',
          '确认后，这些指标只会增强推荐解释链，不会替代医生诊断。',
        ],
      },
      footnote: '确认后，MintBit 会保留你的问卷答案，并把这些指标加入营养建议的解释依据。',
      actions: {
        primary: '确认并更新建议',
        secondary: '稍后处理',
        returnLabel: '返回报告页',
      },
      missingTitle: '没有可确认的 OCR 记录',
      missingBody: '请先返回上传页重新添加体检报告。',
      missingAction: '返回上传页',
      apiFallback: '当前先展示本地确认模板，接口结果可用后会覆盖字段值。',
    },
  },
  en: {
    upload: {
      header: {
        title: 'Upload a health report',
        subtitle: 'Upload a PDF or a clear photo to strengthen the evidence behind your nutrition guidance.',
      },
      hero: {
        eyebrow: 'Optional enhancement',
        title: 'Upload first, then review OCR output',
        body: 'This step does not replace your questionnaire answers. It adds key biomarkers so the later guidance is easier to explain and trust.',
      },
      formatsLabel: 'Supports PDF / JPG / PNG, with a recommended file size under 10 MB',
      chooseSheetTitle: 'Choose upload type',
      chooseImage: 'Upload image',
      choosePdf: 'Upload PDF',
      steps: [
        {
          id: 'upload',
          title: 'Upload the original report',
          body: 'Use a physical exam or lab result from the last 90 days when possible.',
        },
        {
          id: 'processing',
          title: 'System extracts biomarkers',
          body: 'We identify key data first and then route you into manual confirmation.',
        },
        {
          id: 'confirm',
          title: 'Confirm before it enters the report',
          body: 'Low-confidence items stay flagged so you remain the final reviewer.',
        },
      ],
      idleCard: {
        title: 'Choose a file to get started',
        body: 'A full frame, no occlusion, and sharp text will reduce follow-up confirmation work.',
        primaryCta: 'Choose file',
        secondaryCta: 'Maybe later',
        imageCta: 'Choose image',
        pdfCta: 'Choose PDF',
      },
      readyCard: {
        title: 'Your file is ready',
        body: 'Once the file looks right, start recognition and we will move you into the confirmation page automatically.',
        fileNameLabel: 'File name',
        fileSizeLabel: 'File size',
        replaceCta: 'Replace file',
        primaryCta: 'Start recognition',
      },
      processingCard: {
        title: 'Recognizing now',
        body: 'We are extracting key biomarkers and shaping them into a review-ready result.',
        items: ['Reading layout structure', 'Locating key biomarkers', 'Building review-ready entries'],
      },
      footerNote: 'Uploads are used only to explain nutrition guidance and never replace medical diagnosis.',
      missingAssessment: 'No assessment session is available yet. Finish the questionnaire first.',
      uploadFallback: 'The OCR upload API is unavailable, so the flow has fallen back to local confirmation.',
      chooseFailed: 'We could not read the file. Please choose it again.',
    },
    confirmation: {
      header: {
        title: 'OCR review',
        subtitle: 'Confirm the extracted values before using them to strengthen your recommendation explanation.',
      },
      statusCard: {
        eyebrow: 'Report enhancement',
        title: 'Six key biomarkers extracted',
        description: 'Low-confidence fields are highlighted so you can verify them before submission.',
      },
      fileMeta: {
        label: 'Source file',
        value: 'Health report',
        confidenceLabel: 'Overall confidence',
        confidenceValue: 'Needs review',
      },
      confidenceBadges: {
        high: 'High confidence',
        medium: 'Review needed',
        low: 'Low confidence',
      },
      sections: [
        {
          id: 'baseline',
          title: 'Baseline markers',
          fields: [
            {
              id: 'vitamin-d',
              label: '25-OH Vitamin D',
              value: '18 ng/mL',
              confidence: 'medium',
              note: 'The value was read from a note area, so it should be checked against the original report.',
            },
            {
              id: 'hemoglobin',
              label: 'Hemoglobin',
              value: '128 g/L',
              confidence: 'high',
              note: 'Matches the main table text directly.',
            },
            {
              id: 'ferritin',
              label: 'Ferritin',
              value: '21 ng/mL',
              confidence: 'medium',
              note: 'Units were normalized automatically to ng/mL.',
            },
          ],
        },
        {
          id: 'metabolic',
          title: 'Metabolic and inflammation',
          fields: [
            {
              id: 'fasting-glucose',
              label: 'Fasting Glucose',
              value: '5.8 mmol/L',
              confidence: 'high',
              note: 'OCR matches the primary table value exactly.',
            },
            {
              id: 'triglycerides',
              label: 'Triglycerides',
              value: '1.92 mmol/L',
              confidence: 'high',
              note: 'The original lab unit has been preserved.',
            },
            {
              id: 'hs-crp',
              label: 'High-Sensitivity C-Reactive Protein',
              value: '3.2 mg/L',
              confidence: 'low',
              note: 'The scan edge is partially blocked, so check it against the paper report.',
            },
          ],
        },
      ],
      auditTrail: {
        title: 'Recognition and correction log',
        items: [
          'Spacing and unit formatting were normalized without changing your questionnaire answers.',
          'Low-confidence values will remain marked as user-confirmation-needed in the recommendation explanation.',
          'After confirmation, these biomarkers enrich the explanation chain only and do not replace medical diagnosis.',
        ],
      },
      footnote: 'After you confirm, MintBit will keep your questionnaire answers and add these biomarkers to the evidence behind your nutrition guidance.',
      actions: {
        primary: 'Confirm and refresh guidance',
        secondary: 'Do this later',
        returnLabel: 'Back to upload',
      },
      missingTitle: 'No OCR record to review',
      missingBody: 'Return to the upload page and add a health report first.',
      missingAction: 'Back to upload',
      apiFallback: 'The local confirmation template is shown first and will be replaced when API results are available.',
    },
  },
};

export function getOcrUploadContent(locale = 'zh-CN') {
  return (OCR_CONTENT[locale] || OCR_CONTENT['zh-CN']).upload;
}

export function getOcrConfirmationContent(locale = 'zh-CN') {
  return (OCR_CONTENT[locale] || OCR_CONTENT['zh-CN']).confirmation;
}

export function mergeOcrConfirmationSections(templateSections = [], apiSections = []) {
  const sectionMap = new Map(apiSections.map((section) => [section.id, section]));

  return templateSections.map((section) => {
    const nextSection = sectionMap.get(section.id);

    if (!nextSection) {
      return section;
    }

    const fieldMap = new Map((nextSection.fields || []).map((field) => [field.id, field]));

    return {
      ...section,
      fields: section.fields.map((field) => {
        const nextField = fieldMap.get(field.id);

        if (!nextField) {
          return field;
        }

        return {
          ...field,
          value: nextField.value || field.value,
          confidence: nextField.confidence || field.confidence,
        };
      }),
    };
  });
}

export function formatOcrFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
