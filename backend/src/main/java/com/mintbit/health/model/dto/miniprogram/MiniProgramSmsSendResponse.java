package com.mintbit.health.model.dto.miniprogram;

import lombok.Data;

@Data
public class MiniProgramSmsSendResponse {

    private String status;
    private Integer cooldownSeconds;
    private String maskedPhone;
}
