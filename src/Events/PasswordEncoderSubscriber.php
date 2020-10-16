<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder) {
        $this->encoder = $encoder;
    }

    /**
     * Allows a method to be used to hash the password on VIEW event, before its actually
     * sent to the database (PRE WRITE)
     *
     * @return void
     */
    public static function getSubscribedEvents() 
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    /**
     * Method that will be used to hash the password if the data is
     * an instance of User and if the method is POST
     *
     * @param ViewEvent $event
     * @return void
     */
    public function encodePassword(ViewEvent $event) {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($user instanceof User && $method == "POST") {
            $hash = $this->encoder->encodePassword($user, $user->getPassword());     
            $user->setPassword($hash); 
        }
    }
}