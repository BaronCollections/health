package com.mintbit.health.model.dto.account;

import lombok.Data;

import java.util.List;

@Data
public class FeedbackRecordsResponse {

    private List<FeedbackRecordDto> records;
}
