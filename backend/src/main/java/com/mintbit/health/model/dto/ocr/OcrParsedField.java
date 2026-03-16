package com.mintbit.health.model.dto.ocr;

import lombok.Data;

@Data
public class OcrParsedField {

    private String id;
    private String value;
    private String confidence;
}
