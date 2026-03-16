package com.mintbit.health.model.dto.ocr;

import lombok.Data;

import java.util.List;

@Data
public class OcrParsedSection {

    private String id;
    private List<OcrParsedField> fields;
}
