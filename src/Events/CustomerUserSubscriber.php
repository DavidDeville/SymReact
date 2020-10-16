<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface 
{
    private $security;

    public function __construct(Security $security) 
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        /**
         * setUserForCustomer is called on Kernel View Event and on pre validate priority
         */
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * Set the current logged user as the customer's user
     *
     * @param ViewEvent $event
     * @return void
     */
    public function setUserForCustomer(ViewEvent $event) {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($customer instanceof Customer && $method == "POST") {
            $user = $this->security->getUser();
            $customer->setUser($user);
        }    
    }
}