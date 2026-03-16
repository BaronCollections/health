package com.mintbit.health.service;

import com.mintbit.health.model.dto.account.AccountNotificationDto;
import com.mintbit.health.model.dto.account.NotificationListResponse;
import com.mintbit.health.model.dto.account.NotificationReadRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MockAccountService {

    private final Map<String, AccountNotificationDto> notificationsById = new LinkedHashMap<>();

    public MockAccountService() {
        seedNotifications();
    }

    public NotificationListResponse getNotifications(String type) {
        String normalizedFilter = type == null || type.isBlank() ? "all" : type;
        List<AccountNotificationDto> items = notificationsById.values().stream()
                .filter(notification -> "all".equals(normalizedFilter) || normalizedFilter.equals(notification.getType()))
                .map(this::copyNotification)
                .toList();

        NotificationListResponse response = new NotificationListResponse();
        response.setFilter(normalizedFilter);
        response.setUnreadCount((int) items.stream()
                .filter(notification -> "unread".equals(notification.getStatus()))
                .count());
        response.setItems(items);
        return response;
    }

    public AccountNotificationDto getNotification(String notificationId) {
        return copyNotification(requireNotification(notificationId));
    }

    public AccountNotificationDto markNotificationRead(String notificationId) {
        AccountNotificationDto notification = requireNotification(notificationId);
        notification.setStatus("read");
        return copyNotification(notification);
    }

    public NotificationListResponse markNotificationsRead(NotificationReadRequest request) {
        List<String> ids = request == null || request.getIds() == null ? List.of() : request.getIds();
        ids.forEach(id -> requireNotification(id).setStatus("read"));
        return getNotifications(null);
    }

    private AccountNotificationDto requireNotification(String notificationId) {
        AccountNotificationDto notification = notificationsById.get(notificationId);
        if (notification == null) {
            throw new IllegalArgumentException("Notification not found: " + notificationId);
        }
        return notification;
    }

    private AccountNotificationDto copyNotification(AccountNotificationDto source) {
        AccountNotificationDto target = new AccountNotificationDto();
        target.setId(source.getId());
        target.setType(source.getType());
        target.setStatus(source.getStatus());
        target.setTitle(source.getTitle());
        target.setPreview(source.getPreview());
        target.setBody(source.getBody());
        target.setRelativeTime(source.getRelativeTime());
        target.setActionHref(source.getActionHref());
        return target;
    }

    private void seedNotifications() {
        notificationsById.put("notif-1", createNotification(
                "notif-1",
                "system",
                "unread",
                "Your data export package has started generating",
                "The export request is accepted. You will see another reminder here when it is ready.",
                "We have received your export request and it is currently generating. When it is ready, return to the account center to review the delivery method and expiration window.",
                "10m ago",
                "/profile/privacy/export"
        ));
        notificationsById.put("notif-2", createNotification(
                "notif-2",
                "community",
                "unread",
                "Your post moderation status has changed",
                "One post in the Stress reset circle moved from pending to approved.",
                "Your progress post in the Stress reset circle has been approved and is now visible in the public community feed.",
                "35m ago",
                "/community/me"
        ));
        notificationsById.put("notif-3", createNotification(
                "notif-3",
                "checkin",
                "read",
                "Today's check-in reminder is ready",
                "The current plan suggests logging today's intake about 30 minutes after dinner.",
                "Based on your current plan rhythm, the system suggests finishing today's supplement check-in within 30 minutes after dinner for steadier tracking.",
                "Today",
                "/checkin"
        ));
    }

    private AccountNotificationDto createNotification(
            String id,
            String type,
            String status,
            String title,
            String preview,
            String body,
            String relativeTime,
            String actionHref
    ) {
        AccountNotificationDto notification = new AccountNotificationDto();
        notification.setId(id);
        notification.setType(type);
        notification.setStatus(status);
        notification.setTitle(title);
        notification.setPreview(preview);
        notification.setBody(body);
        notification.setRelativeTime(relativeTime);
        notification.setActionHref(actionHref);
        return notification;
    }
}
