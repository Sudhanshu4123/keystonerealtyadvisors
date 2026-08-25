package com.keystone.realestate.controller;

import com.keystone.realestate.model.ContactMessage;
import com.keystone.realestate.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private ContactMessageRepository messageRepository;

    @GetMapping
    public ResponseEntity<?> getMessages() {
        List<ContactMessage> messages = messageRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(Map.of("messages", messages));
    }

    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String phone = body.get("phone");
        String messageStr = body.get("message");

        if (name == null || phone == null || messageStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, phone, and message are required"));
        }

        ContactMessage msg = ContactMessage.builder()
                .name(name.trim())
                .phone(phone.trim())
                .email(body.get("email") != null ? body.get("email").trim() : "")
                .message(messageStr.trim())
                .status("NEW")
                .build();

        ContactMessage saved = messageRepository.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Thank you for reaching out! We have received your message.",
                "contactMessage", saved
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateMessageStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }

        Optional<ContactMessage> msgOpt = messageRepository.findById(id);
        if (msgOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Message not found"));
        }

        ContactMessage msg = msgOpt.get();
        msg.setStatus(status);
        messageRepository.save(msg);

        return ResponseEntity.ok(msg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        if (!messageRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Message not found"));
        }
        messageRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Contact message deleted"));
    }
}
