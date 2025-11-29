import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

/**
 * Controlador de Mascotas
 * Maneja todas las operaciones CRUD y filtros para mascotas
 */
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  /**
   * Crear una nueva mascota
   * POST /api/pets
   */
  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  /**
   * Obtener todas las mascotas
   * GET /api/pets
   */
  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  /**
   * Obtener mascotas de un dueño específico
   * GET /api/pets/owner/:duenoId
   */
  @Get('owner/:duenoId')
  findByOwner(@Param('duenoId') duenoId: string) {
    return this.petsService.findByOwner(+duenoId);
  }

  /**
   * Buscar mascota por código QR
   * GET /api/pets/qr/:codigoQR
   */
  @Get('qr/:codigoQR')
  findByQRCode(@Param('codigoQR') codigoQR: string) {
    return this.petsService.findByQRCode(codigoQR);
  }

  /**
   * Obtener una mascota por ID
   * GET /api/pets/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  /**
   * Actualizar una mascota
   * PATCH /api/pets/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  /**
   * Eliminar una mascota
   * DELETE /api/pets/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
